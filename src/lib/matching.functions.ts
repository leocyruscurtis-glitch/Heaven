// Social event-matching backend.
// - Service-role Supabase access (bypasses RLS).
// - Caller must be a municipality_admin (verified via access token).
// - AI generates ONLY event copy from anonymized, aggregate signals.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type CandidateRow = {
  user_id: string;
  city: string;
  interest_name: string;
  interest_category: string | null;
  intensity: number;
};

type Group = {
  city: string;
  interest_name: string;
  interest_category: string | null;
  user_ids: string[];
  intensities: number[];
};

async function requireAdmin(accessToken: string): Promise<string> {
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) throw new Error("Unauthorized");
  const { data: admin } = await supabaseAdmin
    .from("municipality_admins")
    .select("id")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();
  if (!admin) throw new Error("Admin role required");
  return data.user.id;
}

async function generateEventCopy(opts: {
  shared_interest: string;
  city: string;
  user_count: number;
  intensity_low: number;
  intensity_high: number;
  category: string | null;
}): Promise<{
  title: string;
  description: string;
  match_reason: string;
  invitation_text: string;
}> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    // Safe fallback when AI isn't configured yet.
    return {
      title: `Casual ${opts.shared_interest} meetup in ${opts.city}`,
      description: `A small, beginner-friendly ${opts.shared_interest.toLowerCase()} session for people nearby who already enjoy it.`,
      match_reason: `You were matched because you and a few people in ${opts.city} selected ${opts.shared_interest} with high interest.`,
      invitation_text: `A few people nearby also enjoy ${opts.shared_interest.toLowerCase()}. Join only if it feels right.`,
    };
  }

  const prompt = `Generate a low-pressure, friendly small-group meetup based on a shared hobby.
Return ONLY JSON with keys: title, description, match_reason, invitation_text.

Constraints:
- Tone: warm, calm, civic. Never mention loneliness, dating, or "find friends".
- Use the prompts "Meet people through things you already enjoy" style.
- Title ≤ 60 chars. Description ≤ 240 chars. invitation_text ≤ 180 chars.

Data (safe aggregates only):
- city: ${opts.city}
- shared_interest: ${opts.shared_interest}
- category: ${opts.category ?? "general"}
- group_size: ${opts.user_count}
- intensity_range: ${opts.intensity_low}-${opts.intensity_high} (out of 5)`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You write friendly, low-pressure community event copy." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
  if (!res.ok) throw new Error(`AI gateway error (${res.status})`);

  const json: any = await res.json();
  const text: string = json?.choices?.[0]?.message?.content ?? "{}";
  let parsed: any = {};
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = {};
  }
  return {
    title: parsed.title || `Casual ${opts.shared_interest} meetup in ${opts.city}`,
    description: parsed.description || `A small, beginner-friendly ${opts.shared_interest.toLowerCase()} session.`,
    match_reason:
      parsed.match_reason ||
      `You share ${opts.shared_interest} with ${opts.user_count - 1} people nearby.`,
    invitation_text:
      parsed.invitation_text ||
      `A few people nearby also enjoy ${opts.shared_interest.toLowerCase()}. Join only if it feels right.`,
  };
}

export const runMatching = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        accessToken: z.string().min(10),
        minIntensity: z.number().min(1).max(5).optional(),
        minGroupSize: z.number().min(2).max(20).optional(),
        maxGroupSize: z.number().min(2).max(20).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);

    const minIntensity = data.minIntensity ?? 4;
    const minGroupSize = data.minGroupSize ?? 3;
    const maxGroupSize = data.maxGroupSize ?? 6;

    // 1. Fetch candidate (user, city, interest) rows with strong intensity.
    const { data: rows, error } = await supabaseAdmin
      .from("user_interests")
      .select("user_id, intensity, interest_name, interest_category, users!inner(id, city)")
      .gte("intensity", minIntensity)
      .not("interest_name", "is", null);
    if (error) throw new Error(error.message);

    const candidates: CandidateRow[] = (rows ?? [])
      .map((r: any) => ({
        user_id: r.user_id,
        city: (r.users?.city ?? "").trim(),
        interest_name: (r.interest_name ?? "").trim(),
        interest_category: r.interest_category ?? null,
        intensity: r.intensity,
      }))
      .filter((r) => r.city && r.interest_name);

    // 2. Group by (city, interest_name)
    const groups = new Map<string, Group>();
    for (const c of candidates) {
      const key = `${c.city.toLowerCase()}|${c.interest_name.toLowerCase()}`;
      const g =
        groups.get(key) ??
        ({
          city: c.city,
          interest_name: c.interest_name,
          interest_category: c.interest_category,
          user_ids: [],
          intensities: [],
        } as Group);
      if (!g.user_ids.includes(c.user_id)) {
        g.user_ids.push(c.user_id);
        g.intensities.push(c.intensity);
      }
      groups.set(key, g);
    }

    const created: any[] = [];
    const skipped: any[] = [];

    for (const g of groups.values()) {
      if (g.user_ids.length < minGroupSize) {
        skipped.push({ city: g.city, shared_interest: g.interest_name, reason: "too few users", size: g.user_ids.length });
        continue;
      }

      // 3. Cluster by intensity proximity: take users within ±1 of the median.
      const sorted = g.intensities.slice().sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const paired = g.user_ids.map((id, i) => ({ id, intensity: g.intensities[i] }));
      const cluster = paired.filter((p) => Math.abs(p.intensity - median) <= 1);
      if (cluster.length < minGroupSize) {
        skipped.push({ city: g.city, shared_interest: g.interest_name, reason: "intensity spread", size: cluster.length });
        continue;
      }
      const chosen = cluster.slice(0, maxGroupSize);
      const chosenIds = chosen.map((p) => p.id).sort();

      // 4. Avoid duplicate active suggestion for same city+interest+exact user set
      const { data: existing } = await supabaseAdmin
        .from("event_suggestions")
        .select("id, status, event_participants(user_id)")
        .eq("city", g.city)
        .eq("shared_interest", g.interest_name)
        .neq("status", "cancelled");

      const dup = (existing ?? []).some((e: any) => {
        const ids = ((e.event_participants ?? []) as any[]).map((p) => p.user_id).sort();
        return ids.length === chosenIds.length && ids.every((v, i) => v === chosenIds[i]);
      });
      if (dup) {
        skipped.push({ city: g.city, shared_interest: g.interest_name, reason: "duplicate active suggestion", size: chosen.length });
        continue;
      }

      // 5. AI copy
      const intensities = chosen.map((p) => p.intensity);
      const copy = await generateEventCopy({
        shared_interest: g.interest_name,
        city: g.city,
        user_count: chosen.length,
        intensity_low: Math.min(...intensities),
        intensity_high: Math.max(...intensities),
        category: g.interest_category,
      });

      // 6. Insert suggestion + participants
      const { data: ev, error: e2 } = await supabaseAdmin
        .from("event_suggestions")
        .insert({
          created_by_ai: !!process.env.LOVABLE_API_KEY,
          title: copy.title,
          description: copy.description,
          shared_interest: g.interest_name,
          city: g.city,
          suggested_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          max_participants: maxGroupSize,
          status: "suggested",
          match_reason: copy.match_reason,
          invitation_text: copy.invitation_text,
        })
        .select()
        .single();
      if (e2 || !ev) throw new Error(e2?.message ?? "Failed to create suggestion");

      const partsRows = chosenIds.map((uid) => ({
        event_id: ev.id,
        user_id: uid,
        invitation_status: "invited" as const,
      }));
      const { error: e3 } = await supabaseAdmin.from("event_participants").insert(partsRows);
      if (e3) throw new Error(e3.message);

      created.push({
        event_id: ev.id,
        title: ev.title,
        city: g.city,
        shared_interest: g.interest_name,
        group_size: chosen.length,
        participant_ids: chosenIds,
        status: ev.status,
      });
    }

    return { created, skipped, totalGroups: groups.size, aiConfigured: !!process.env.LOVABLE_API_KEY };
  });

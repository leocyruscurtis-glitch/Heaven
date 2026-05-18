import { $ as TSS_SERVER_FUNCTION, a0 as createServerFn } from "./server-zgXUd0Aa.js";
import { c as createClient, o as object, n as number, s as string } from "./index-9qQULOcK.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
async function requireAdmin(accessToken) {
  const {
    data,
    error
  } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) throw new Error("Unauthorized");
  const {
    data: admin
  } = await supabaseAdmin.from("municipality_admins").select("id").eq("auth_user_id", data.user.id).maybeSingle();
  if (!admin) throw new Error("Admin role required");
  return data.user.id;
}
async function generateEventCopy(opts) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return {
      title: `Casual ${opts.shared_interest} meetup in ${opts.city}`,
      description: `A small, beginner-friendly ${opts.shared_interest.toLowerCase()} session for people nearby who already enjoy it.`,
      match_reason: `You were matched because you and a few people in ${opts.city} selected ${opts.shared_interest} with high interest.`,
      invitation_text: `A few people nearby also enjoy ${opts.shared_interest.toLowerCase()}. Join only if it feels right.`
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{
        role: "system",
        content: "You write friendly, low-pressure community event copy."
      }, {
        role: "user",
        content: prompt
      }],
      response_format: {
        type: "json_object"
      }
    })
  });
  if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
  if (!res.ok) throw new Error(`AI gateway error (${res.status})`);
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content ?? "{}";
  let parsed = {};
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = {};
  }
  return {
    title: parsed.title || `Casual ${opts.shared_interest} meetup in ${opts.city}`,
    description: parsed.description || `A small, beginner-friendly ${opts.shared_interest.toLowerCase()} session.`,
    match_reason: parsed.match_reason || `You share ${opts.shared_interest} with ${opts.user_count - 1} people nearby.`,
    invitation_text: parsed.invitation_text || `A few people nearby also enjoy ${opts.shared_interest.toLowerCase()}. Join only if it feels right.`
  };
}
const runMatching_createServerFn_handler = createServerRpc({
  id: "577fd75b88080caeb9ffe7939e431024f7655abc0df50436c00c801cb0b140ee",
  name: "runMatching",
  filename: "src/lib/matching.functions.ts"
}, (opts) => runMatching.__executeServer(opts));
const runMatching = createServerFn({
  method: "POST"
}).inputValidator((input) => object({
  accessToken: string().min(10),
  minIntensity: number().min(1).max(5).optional(),
  minGroupSize: number().min(2).max(20).optional(),
  maxGroupSize: number().min(2).max(20).optional()
}).parse(input)).handler(runMatching_createServerFn_handler, async ({
  data
}) => {
  await requireAdmin(data.accessToken);
  const minIntensity = data.minIntensity ?? 4;
  const minGroupSize = data.minGroupSize ?? 3;
  const maxGroupSize = data.maxGroupSize ?? 6;
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("user_interests").select("user_id, intensity, interest_name, interest_category, users!inner(id, city)").gte("intensity", minIntensity).not("interest_name", "is", null);
  if (error) throw new Error(error.message);
  const candidates = (rows ?? []).map((r) => ({
    user_id: r.user_id,
    city: (r.users?.city ?? "").trim(),
    interest_name: (r.interest_name ?? "").trim(),
    interest_category: r.interest_category ?? null,
    intensity: r.intensity
  })).filter((r) => r.city && r.interest_name);
  const groups = /* @__PURE__ */ new Map();
  for (const c of candidates) {
    const key = `${c.city.toLowerCase()}|${c.interest_name.toLowerCase()}`;
    const g = groups.get(key) ?? {
      city: c.city,
      interest_name: c.interest_name,
      interest_category: c.interest_category,
      user_ids: [],
      intensities: []
    };
    if (!g.user_ids.includes(c.user_id)) {
      g.user_ids.push(c.user_id);
      g.intensities.push(c.intensity);
    }
    groups.set(key, g);
  }
  const created = [];
  const skipped = [];
  for (const g of groups.values()) {
    if (g.user_ids.length < minGroupSize) {
      skipped.push({
        city: g.city,
        shared_interest: g.interest_name,
        reason: "too few users",
        size: g.user_ids.length
      });
      continue;
    }
    const sorted = g.intensities.slice().sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const paired = g.user_ids.map((id, i) => ({
      id,
      intensity: g.intensities[i]
    }));
    const cluster = paired.filter((p) => Math.abs(p.intensity - median) <= 1);
    if (cluster.length < minGroupSize) {
      skipped.push({
        city: g.city,
        shared_interest: g.interest_name,
        reason: "intensity spread",
        size: cluster.length
      });
      continue;
    }
    const chosen = cluster.slice(0, maxGroupSize);
    const chosenIds = chosen.map((p) => p.id).sort();
    const {
      data: existing
    } = await supabaseAdmin.from("event_suggestions").select("id, status, event_participants(user_id)").eq("city", g.city).eq("shared_interest", g.interest_name).neq("status", "cancelled");
    const dup = (existing ?? []).some((e) => {
      const ids = (e.event_participants ?? []).map((p) => p.user_id).sort();
      return ids.length === chosenIds.length && ids.every((v, i) => v === chosenIds[i]);
    });
    if (dup) {
      skipped.push({
        city: g.city,
        shared_interest: g.interest_name,
        reason: "duplicate active suggestion",
        size: chosen.length
      });
      continue;
    }
    const intensities = chosen.map((p) => p.intensity);
    const copy = await generateEventCopy({
      shared_interest: g.interest_name,
      city: g.city,
      user_count: chosen.length,
      intensity_low: Math.min(...intensities),
      intensity_high: Math.max(...intensities),
      category: g.interest_category
    });
    const {
      data: ev,
      error: e2
    } = await supabaseAdmin.from("event_suggestions").insert({
      created_by_ai: !!process.env.LOVABLE_API_KEY,
      title: copy.title,
      description: copy.description,
      shared_interest: g.interest_name,
      city: g.city,
      suggested_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
      max_participants: maxGroupSize,
      status: "suggested",
      match_reason: copy.match_reason,
      invitation_text: copy.invitation_text
    }).select().single();
    if (e2 || !ev) throw new Error(e2?.message ?? "Failed to create suggestion");
    const partsRows = chosenIds.map((uid) => ({
      event_id: ev.id,
      user_id: uid,
      invitation_status: "invited"
    }));
    const {
      error: e3
    } = await supabaseAdmin.from("event_participants").insert(partsRows);
    if (e3) throw new Error(e3.message);
    created.push({
      event_id: ev.id,
      title: ev.title,
      city: g.city,
      shared_interest: g.interest_name,
      group_size: chosen.length,
      participant_ids: chosenIds,
      status: ev.status
    });
  }
  return {
    created,
    skipped,
    totalGroups: groups.size,
    aiConfigured: !!process.env.LOVABLE_API_KEY
  };
});
export {
  runMatching_createServerFn_handler
};

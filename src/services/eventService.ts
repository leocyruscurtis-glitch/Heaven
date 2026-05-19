import { supabase } from "@/integrations/supabase/client";
import { read, write, subscribe } from "./db";
import { TABLES, type CivicEvent, type User } from "./types";
import { hydrateEvents } from "./syncService";

export const eventService = {
  list(filter?: { zoneId?: string; category?: string }): CivicEvent[] {
    let rows = read<CivicEvent>(TABLES.events);
    if (filter?.zoneId) rows = rows.filter((e) => e.zone_id === filter.zoneId);
    if (filter?.category) rows = rows.filter((e) => e.category === filter.category);
    return rows;
  },
  byId(id: string): CivicEvent | null {
    return read<CivicEvent>(TABLES.events).find((e) => e.id === id) ?? null;
  },
  byOrganiser(organiserId: string): CivicEvent[] {
    return read<CivicEvent>(TABLES.events).filter((e) => e.organiser_id === organiserId);
  },
  async create(
    organiserId: string,
    organiserName: string,
    input: Partial<CivicEvent> & {
      title: string;
      category: string;
      zone_id: string;
      lat: number;
      lng: number;
    },
  ): Promise<CivicEvent> {
    const row = {
      organiser_id: organiserId,
      organiser_name: organiserName,
      organiser_verified: true,
      title: input.title,
      category: input.category,
      subcategory: input.subcategory ?? input.category,
      icon: input.icon ?? "📍",
      description: input.description ?? "",
      zone_id: input.zone_id,
      location_name: input.location_name ?? "TBA",
      lat: input.lat,
      lng: input.lng,
      start_time: input.start_time ?? "Today",
      start_in_min: input.start_in_min ?? 120,
      status: "scheduled" as const,
      is_live: false,
      min_capacity: input.min_capacity ?? 4,
      max_capacity: input.max_capacity ?? 12,
      current_registration: 0,
      beginner_friendly: input.beginner_friendly ?? true,
      skill_level: input.skill_level ?? "Any",
      age_range_min: input.age_range_min ?? 18,
      age_range_max: input.age_range_max ?? 99,
      gender_requirement_optional: input.gender_requirement_optional ?? null,
      gender_requirement_reason: input.gender_requirement_reason ?? null,
      accessibility_info: input.accessibility_info ?? "Step-free entry",
      equipment_needed: input.equipment_needed ?? [],
      people_usually_come_alone: input.people_usually_come_alone ?? true,
      welcome_host_present: input.welcome_host_present ?? true,
      welcome_host_description: input.welcome_host_description ?? null,
      verified_organiser_required: true,
      team_based: input.team_based ?? false,
      team_size: input.team_size ?? null,
      spectators_allowed: input.spectators_allowed ?? true,
      bring_friend_allowed: input.bring_friend_allowed ?? true,
      recommendation_reason:
        input.recommendation_reason ??
        `Recommended because you selected ${input.category.toLowerCase()}.`,
      distance_km: input.distance_km ?? 1.0,
    };
    const { error } = await supabase.from("events").insert(row).select().maybeSingle();
    if (error) throw new Error(error.message);
    await hydrateEvents();
    return (read<CivicEvent>(TABLES.events).find((e) => e.title === row.title) ??
      (row as unknown as CivicEvent));
  },
  async update(id: string, partial: Partial<CivicEvent>): Promise<CivicEvent | null> {
    const { data, error } = await supabase
      .from("events")
      .update({ ...partial, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) {
      const rows = read<CivicEvent>(TABLES.events);
      const idx = rows.findIndex((r) => r.id === id);
      const next = { ...(data as any) } as CivicEvent;
      if (idx >= 0) rows[idx] = next;
      else rows.push(next);
      write(TABLES.events, rows);
    }
    return (data as CivicEvent) ?? null;
  },
  async remove(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw new Error(error.message);
    write(
      TABLES.events,
      read<CivicEvent>(TABLES.events).filter((e) => e.id !== id),
    );
  },
  async refresh() {
    await hydrateEvents();
  },
  onChange(cb: () => void) {
    return subscribe(TABLES.events, cb);
  },
};

// Eligibility check (pure, no DB).
export function eligibilityReason(e: CivicEvent, u: User | null, radiusKm: number): string | null {
  if (e.status === "cancelled_low_registration") return "This event has been cancelled.";
  if (e.status === "full") return "This event is full.";
  if (e.distance_km > radiusKm) return "This event is outside your selected radius.";
  if (u) {
    const a = parseAgeMid(u.age_range);
    if (a !== null && (a < e.age_range_min || a > e.age_range_max))
      return `This event is outside your age range (${e.age_range_min}–${e.age_range_max}).`;
    if (
      e.gender_requirement_optional &&
      u.gender_optional &&
      e.gender_requirement_optional !== u.gender_optional
    )
      return `This event has a specific comfort requirement: ${e.gender_requirement_reason ?? ""}.`;
  }
  return null;
}

function parseAgeMid(range: string | null): number | null {
  if (!range) return null;
  const m = range.match(/(\d+)/g);
  if (!m) return null;
  if (m.length === 1) return Number(m[0]);
  return (Number(m[0]) + Number(m[1])) / 2;
}

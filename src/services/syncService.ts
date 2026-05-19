// Hydrates the in-memory cache from Supabase. Runs on auth state change and
// after mutations. Supabase remains the source of truth.

import { supabase } from "@/integrations/supabase/client";
import { write, bumpAll } from "./db";
import { TABLES, type Session } from "./types";

function mapEventRow(r: any) {
  return {
    id: r.id,
    organiser_id: r.organiser_id,
    organiser_name: r.organiser_name,
    organiser_verified: r.organiser_verified,
    title: r.title,
    category: r.category,
    subcategory: r.subcategory ?? r.category,
    icon: r.icon ?? "📍",
    description: r.description ?? "",
    zone_id: r.zone_id,
    location_name: r.location_name ?? "",
    address: r.address ?? undefined,
    lat: Number(r.lat),
    lng: Number(r.lng),
    start_time: r.start_time ?? "",
    start_in_min: r.start_in_min ?? 120,
    end_time: r.end_time ?? undefined,
    status: r.status,
    is_live: r.is_live,
    min_capacity: r.min_capacity,
    max_capacity: r.max_capacity,
    current_registration: r.current_registration,
    beginner_friendly: r.beginner_friendly,
    skill_level: r.skill_level ?? "Any",
    age_range_min: r.age_range_min,
    age_range_max: r.age_range_max,
    gender_requirement_optional: r.gender_requirement_optional,
    gender_requirement_reason: r.gender_requirement_reason,
    accessibility_info: r.accessibility_info ?? "",
    equipment_needed: Array.isArray(r.equipment_needed) ? r.equipment_needed : [],
    people_usually_come_alone: r.people_usually_come_alone,
    welcome_host_present: r.welcome_host_present,
    welcome_host_description: r.welcome_host_description ?? undefined,
    verified_organiser_required: r.verified_organiser_required,
    team_based: r.team_based,
    team_size: r.team_size ?? undefined,
    spectators_allowed: r.spectators_allowed,
    bring_friend_allowed: r.bring_friend_allowed,
    recommendation_reason: r.recommendation_reason ?? "",
    distance_km: Number(r.distance_km ?? 1),
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export async function hydrateEvents() {
  const { data } = await supabase.from("events").select("*").order("start_in_min");
  write(TABLES.events, (data ?? []).map(mapEventRow));
}

export async function hydrateRegistrations() {
  const { data } = await supabase.from("event_registrations").select("*");
  write(TABLES.registrations, data ?? []);
}

export async function hydrateCheckins() {
  const { data } = await supabase.from("check_ins").select("*");
  write(TABLES.checkins, data ?? []);
}

export async function hydrateTeams() {
  const { data } = await supabase.from("team_assignments").select("*");
  write(TABLES.teams, data ?? []);
}

export async function hydrateAiProposals() {
  const { data } = await supabase.from("ai_event_proposals").select("*");
  write(TABLES.aiProposals, data ?? []);
}

export async function hydrateUser(authId: string) {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", authId)
    .maybeSingle();
  if (data) write(TABLES.users, [data]);
  return data;
}

export async function hydrateOrganiser(authId: string) {
  const { data } = await supabase
    .from("organisers")
    .select("*")
    .eq("auth_user_id", authId)
    .maybeSingle();
  if (data) {
    write(TABLES.organisers, [data]);
    const { data: vs } = await supabase
      .from("organiser_verification_steps")
      .select("*")
      .eq("organiser_id", data.id)
      .maybeSingle();
    if (vs) write(TABLES.verification, [vs]);
  }
  return data;
}

export async function hydrateAdmin(authId: string) {
  const { data } = await supabase
    .from("municipality_admins")
    .select("*")
    .eq("auth_user_id", authId)
    .maybeSingle();
  if (data) write(TABLES.admins, [data]);
  return data;
}

export async function hydrateMetrics() {
  const { data } = await supabase.from("municipality_metrics").select("*");
  write("municipality_metrics", data ?? []);
}

// Full hydration for the given session.
export async function hydrateForSession(session: Session | null) {
  if (!session) {
    write(TABLES.users, []);
    write(TABLES.organisers, []);
    write(TABLES.admins, []);
    write(TABLES.registrations, []);
    write(TABLES.checkins, []);
    write(TABLES.teams, []);
    write(TABLES.verification, []);
    write(TABLES.events, []);
    write(TABLES.aiProposals, []);
    write("municipality_metrics", []);
    bumpAll();
    return;
  }
  await hydrateEvents();
  if (session.role === "resident") {
    await hydrateUser(session.auth_user_id);
    await hydrateRegistrations();
    await hydrateCheckins();
    await hydrateTeams();
  } else if (session.role === "organiser") {
    await hydrateOrganiser(session.auth_user_id);
    await hydrateRegistrations();
    await hydrateCheckins();
    await hydrateTeams();
    await hydrateAiProposals();
  } else if (session.role === "municipality_admin") {
    await hydrateAdmin(session.auth_user_id);
    await hydrateMetrics();
    await hydrateAiProposals();
  }
  bumpAll();
}

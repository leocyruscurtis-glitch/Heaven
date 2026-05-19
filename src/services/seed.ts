// Seed initial data (zones/interests are static; events from mock-data) on first run.
import { read, write, uid, nowIso } from "./db";
import { TABLES, type CivicEvent, type Organiser, type AuthAccount } from "./types";
import { events as MOCK_EVENTS } from "@/lib/mock-data";

const DEMO_ORG_ID = "org_demo_rotterdam";
const DEMO_AUTH_ID = "auth_demo_org";

export function seedIfEmpty() {
  const seeded = read<{ id: string }>(TABLES.seeded);
  if (seeded.length) return;

  // Demo verified organiser owning all seeded events
  const demoOrgAuth: AuthAccount = {
    id: DEMO_AUTH_ID,
    email: "demo@rotterdam.nl",
    password: "demo",
    role: "organiser",
    created_at: nowIso(),
  };
  const demoOrg: Organiser = {
    id: DEMO_ORG_ID,
    auth_user_id: DEMO_AUTH_ID,
    role: "organiser",
    name: "Gemeente Rotterdam (demo seed)",
    type: "municipality_department",
    email: "demo@rotterdam.nl",
    phone: null,
    verification_status: "verified",
    municipality_zone_id: "kralingen",
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  write(TABLES.auth, [demoOrgAuth]);
  write(TABLES.organisers, [demoOrg]);

  const events: CivicEvent[] = MOCK_EVENTS.map((e) => {
    const [lat, lng] = e.coords.split(",").map((s) => parseFloat(s.trim()));
    return {
      id: e.id,
      organiser_id: DEMO_ORG_ID,
      organiser_name: e.organiser,
      organiser_verified: e.organiserVerified,
      title: e.title,
      category: e.category,
      subcategory: e.subcategory,
      icon: e.icon,
      description: e.description,
      zone_id: e.zoneId,
      location_name: e.locationName,
      lat,
      lng,
      start_time: e.startTime,
      start_in_min: e.startInMin,
      status: mapLegacyStatus(e.status),
      is_live: e.isLive,
      min_capacity: e.minCapacity,
      max_capacity: e.maxCapacity,
      current_registration: e.currentRegistration,
      beginner_friendly: e.beginnerFriendly,
      skill_level: e.skillLevel,
      age_range_min: e.ageRangeMin,
      age_range_max: e.ageRangeMax,
      accessibility_info: e.accessibility,
      equipment_needed: e.whatToBring,
      people_usually_come_alone: e.peopleComeAlone,
      welcome_host_present: e.welcomeHost,
      verified_organiser_required: true,
      team_based: e.teamBased,
      team_size: e.teamSize,
      spectators_allowed: e.spectatorsAllowed,
      bring_friend_allowed: e.bringFriendAllowed,
      recommendation_reason: e.recommendationReason,
      distance_km: e.distanceKm,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
  });
  write(TABLES.events, events);

  // Sample AI proposals (linked to demo org so any organiser can review them in demo mode)
  write(TABLES.aiProposals, [
    {
      id: uid("ai"),
      zone_id: "kralingen",
      organiser_id: null,
      detected_theme: "Basketball",
      detected_interest_count: 14,
      suggested_location_name: "Kralingen Court",
      suggested_lat: 51.9231,
      suggested_lng: 4.5321,
      suggested_start_time: "Today 18:30",
      weather_note: "Clear, 18°C",
      proposal_reason:
        "AI detected high basketball interest in Kralingen tonight. 14 nearby users selected basketball. Weather is clear.",
      status: "proposed",
      created_at: nowIso(),
    },
    {
      id: uid("ai"),
      zone_id: "centrum",
      organiser_id: null,
      detected_theme: "Karaoke",
      detected_interest_count: 7,
      suggested_location_name: "KaraokeBar Centrum",
      suggested_lat: 51.9201,
      suggested_lng: 4.479,
      suggested_start_time: "Fri 20:00",
      weather_note: "Indoor",
      proposal_reason:
        "7 nearby users selected karaoke this week. Venue KaraokeBar Centrum available Friday.",
      status: "proposed",
      created_at: nowIso(),
    },
  ]);

  write(TABLES.seeded, [{ id: "seeded", at: nowIso() } as any]);
}

function mapLegacyStatus(s: string): CivicEvent["status"] {
  switch (s) {
    case "live":
      return "live";
    case "scheduled":
      return "scheduled";
    case "almost-full":
      return "almost_full";
    case "full":
      return "full";
    case "at-risk":
      return "at_risk_of_cancellation";
    case "cancelled":
      return "cancelled_low_registration";
    case "minimum-reached":
      return "minimum_reached";
    default:
      return "open";
  }
}

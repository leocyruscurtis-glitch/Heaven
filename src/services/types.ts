// Domain types for the Haven "backend". Mirror Supabase table shapes.

export type Role = "resident" | "organiser" | "municipality_admin";

export type AuthAccount = {
  id: string; // auth_user_id
  email: string;
  password: string; // plain for prototype only
  role: Role;
  created_at: string;
};

export type Session = {
  auth_user_id: string;
  role: Role;
  profile_id: string; // user.id or organiser.id or admin.id
};

export type User = {
  id: string;
  auth_user_id: string;
  role: "resident";
  age_range: string | null;
  gender_optional: string | null;
  location_zone_id: string;
  radius_km: number;
  onboarding_complete: boolean;
  selected_interests: string[];
  notification_preferences: Record<string, boolean>;
  accessibility_preferences: {
    fontScale: number;
    reducedMotion: boolean;
    highContrast: boolean;
    colorblind: boolean;
  };
  privacy_settings: { pauseRecs: boolean; hideFromMatching: boolean };
  full_name: string | null;
  age: number | null;
  city: string | null;
  short_bio: string | null;
  created_at: string;
  updated_at: string;
};

export type OrganiserType =
  | "municipality_department"
  | "sports_club"
  | "library"
  | "school"
  | "university"
  | "community_center"
  | "ngo"
  | "neighbourhood_volunteer";

export type VerificationStatus =
  | "not_started"
  | "in_progress"
  | "awaiting_review"
  | "verified"
  | "rejected"
  | "needs_correction";

export type Organiser = {
  id: string;
  auth_user_id: string;
  role: "organiser";
  name: string;
  type: OrganiserType;
  email: string;
  phone: string | null;
  verification_status: VerificationStatus;
  municipality_zone_id: string;
  created_at: string;
  updated_at: string;
};

export type VerificationSteps = {
  id: string;
  organiser_id: string;
  email_verified: boolean;
  phone_verified: boolean;
  id_verified: boolean;
  vog_status: boolean;
  kvk_status: boolean;
  ubo_status: boolean;
  municipality_token_status: boolean;
  iban_status: boolean;
  btw_status: boolean;
  overall_status: VerificationStatus;
  updated_at: string;
};

export type MunicipalityAdmin = {
  id: string;
  auth_user_id: string;
  role: "municipality_admin";
  name: string;
  municipality: string;
  created_at: string;
};

export type EventStatus =
  | "open"
  | "live"
  | "scheduled"
  | "minimum_reached"
  | "almost_full"
  | "full"
  | "at_risk_of_cancellation"
  | "cancelled_low_registration"
  | "completed";

export type CivicEvent = {
  id: string;
  organiser_id: string;
  organiser_name: string;
  organiser_verified: boolean;
  title: string;
  category: string;
  subcategory: string;
  icon: string;
  description: string;
  zone_id: string;
  location_name: string;
  address?: string;
  lat: number;
  lng: number;
  start_time: string; // human readable
  start_in_min: number; // for sort/status simulation
  end_time?: string;
  status: EventStatus;
  is_live: boolean;
  min_capacity: number;
  max_capacity: number;
  current_registration: number;
  beginner_friendly: boolean;
  skill_level: "Any" | "Beginner" | "Intermediate" | "Advanced";
  age_range_min: number;
  age_range_max: number;
  gender_requirement_optional?: string | null;
  gender_requirement_reason?: string | null;
  accessibility_info: string;
  equipment_needed: string[];
  people_usually_come_alone: boolean;
  welcome_host_present: boolean;
  welcome_host_description?: string;
  verified_organiser_required: boolean;
  team_based: boolean;
  team_size?: number;
  spectators_allowed: boolean;
  bring_friend_allowed: boolean;
  recommendation_reason: string;
  distance_km: number;
  created_at: string;
  updated_at: string;
};

export type ParticipationState =
  | "Interested"
  | "Maybe"
  | "Join"
  | "Remind me later"
  | "Bring a friend"
  | "Spectator";

export type EventRegistration = {
  id: string;
  event_id: string;
  user_id: string;
  participation_state: ParticipationState;
  bring_friend: boolean;
  linked_friend_group_id?: string | null;
  checked_in: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamAssignment = {
  id: string;
  event_id: string;
  team_label: string;
  user_id: string;
  created_at: string;
};

export type CheckIn = {
  id: string;
  event_id: string;
  user_id: string;
  checked_in_at: string;
  method: "QR" | "im_here" | "host_confirmation";
};

export type AiProposal = {
  id: string;
  zone_id: string;
  organiser_id: string | null;
  detected_theme: string;
  detected_interest_count: number;
  suggested_location_name: string;
  suggested_lat: number;
  suggested_lng: number;
  suggested_start_time: string;
  weather_note: string;
  proposal_reason: string;
  status: "proposed" | "approved" | "edited" | "rejected" | "published";
  created_at: string;
};

export const TABLES = {
  auth: "auth_accounts",
  session: "session",
  users: "users",
  organisers: "organisers",
  verification: "organiser_verification_steps",
  admins: "municipality_admins",
  events: "events",
  registrations: "event_registrations",
  teams: "team_assignments",
  checkins: "check_ins",
  aiProposals: "ai_event_proposals",
  seeded: "_seeded",
} as const;

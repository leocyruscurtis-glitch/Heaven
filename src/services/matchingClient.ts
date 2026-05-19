// Social matching client services (RLS-scoped via user's supabase client).
import { supabase } from "@/integrations/supabase/client";

export type UserInterestRow = {
  id: string;
  user_id: string;
  interest_name: string | null;
  interest_category: string | null;
  intensity: number;
  created_at: string;
};

export type EventSuggestionRow = {
  id: string;
  title: string;
  description: string | null;
  shared_interest: string;
  city: string;
  suggested_date: string | null;
  max_participants: number;
  status: "suggested" | "accepted" | "cancelled";
  match_reason: string | null;
  invitation_text: string | null;
  created_at: string;
};

export type EventParticipantRow = {
  id: string;
  event_id: string;
  user_id: string;
  invitation_status: "invited" | "accepted" | "declined";
  created_at: string;
};

export async function listMyInterests(userId: string): Promise<UserInterestRow[]> {
  const { data, error } = await supabase
    .from("user_interests")
    .select("id, user_id, interest_name, interest_category, intensity, created_at")
    .eq("user_id", userId)
    .not("interest_name", "is", null)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as UserInterestRow[];
}

export async function addInterest(input: {
  userId: string;
  interest_name: string;
  interest_category: string;
  intensity: number;
}): Promise<UserInterestRow> {
  const { data, error } = await supabase
    .from("user_interests")
    .insert({
      user_id: input.userId,
      interest_name: input.interest_name,
      interest_category: input.interest_category,
      intensity: input.intensity,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as UserInterestRow;
}

export async function updateInterest(id: string, patch: Partial<Pick<UserInterestRow, "interest_category" | "intensity" | "interest_name">>) {
  const { error } = await supabase.from("user_interests").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function removeInterest(id: string) {
  const { error } = await supabase.from("user_interests").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateProfile(userId: string, patch: { full_name?: string; age?: number | null; city?: string; short_bio?: string | null }) {
  const { error } = await supabase.from("users").update(patch).eq("id", userId);
  if (error) throw new Error(error.message);
}

export async function listMySuggestions(): Promise<
  Array<EventSuggestionRow & { my_status: EventParticipantRow["invitation_status"]; my_participant_id: string; participant_count: number }>
> {
  // event_suggestions RLS limits rows to ones where user is in event_participants
  const { data: events, error } = await supabase
    .from("event_suggestions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  if (!events?.length) return [];

  const { data: myParts, error: e2 } = await supabase
    .from("event_participants")
    .select("id, event_id, invitation_status")
    .in(
      "event_id",
      events.map((e) => e.id),
    );
  if (e2) throw new Error(e2.message);

  const partMap = new Map((myParts ?? []).map((p) => [p.event_id, p]));

  return events.map((e) => {
    const mine = partMap.get(e.id);
    return {
      ...(e as EventSuggestionRow),
      my_status: (mine?.invitation_status ?? "invited") as EventParticipantRow["invitation_status"],
      my_participant_id: mine?.id ?? "",
      // Privacy-safe: only the suggested capacity, not actual participant list
      participant_count: e.max_participants,
    };
  });
}

export async function respondToInvitation(participantId: string, status: "accepted" | "declined") {
  const { error } = await supabase
    .from("event_participants")
    .update({ invitation_status: status })
    .eq("id", participantId);
  if (error) throw new Error(error.message);
}

export const INTEREST_CATEGORIES = [
  "Sports",
  "Board Games",
  "Literature",
  "Music",
  "Dance",
  "Gaming",
  "Cooking",
  "Volunteering",
  "Study",
  "Walking",
  "Language Exchange",
  "Art",
] as const;

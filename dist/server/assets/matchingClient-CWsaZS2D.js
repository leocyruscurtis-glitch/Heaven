import { f as supabase } from "./router-qGr_Hydj.js";
async function listMyInterests(userId) {
  const { data, error } = await supabase.from("user_interests").select("id, user_id, interest_name, interest_category, intensity, created_at").eq("user_id", userId).not("interest_name", "is", null).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
async function addInterest(input) {
  const { data, error } = await supabase.from("user_interests").insert({
    user_id: input.userId,
    interest_name: input.interest_name,
    interest_category: input.interest_category,
    intensity: input.intensity
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}
async function updateInterest(id, patch) {
  const { error } = await supabase.from("user_interests").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}
async function removeInterest(id) {
  const { error } = await supabase.from("user_interests").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
async function updateProfile(userId, patch) {
  const { error } = await supabase.from("users").update(patch).eq("id", userId);
  if (error) throw new Error(error.message);
}
async function listMySuggestions() {
  const { data: events, error } = await supabase.from("event_suggestions").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  if (!events?.length) return [];
  const { data: myParts, error: e2 } = await supabase.from("event_participants").select("id, event_id, invitation_status").in(
    "event_id",
    events.map((e) => e.id)
  );
  if (e2) throw new Error(e2.message);
  const partMap = new Map((myParts ?? []).map((p) => [p.event_id, p]));
  return events.map((e) => {
    const mine = partMap.get(e.id);
    return {
      ...e,
      my_status: mine?.invitation_status ?? "invited",
      my_participant_id: mine?.id ?? "",
      // Privacy-safe: only the suggested capacity, not actual participant list
      participant_count: e.max_participants
    };
  });
}
async function respondToInvitation(participantId, status) {
  const { error } = await supabase.from("event_participants").update({ invitation_status: status }).eq("id", participantId);
  if (error) throw new Error(error.message);
}
const INTEREST_CATEGORIES = [
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
  "Art"
];
export {
  INTEREST_CATEGORIES as I,
  listMyInterests as a,
  addInterest as b,
  updateInterest as c,
  removeInterest as d,
  listMySuggestions as l,
  respondToInvitation as r,
  updateProfile as u
};

import { supabase } from "@/integrations/supabase/client";
import { read, write, subscribe } from "./db";
import { TABLES, type EventRegistration, type ParticipationState, type CheckIn } from "./types";
import { hydrateEvents, hydrateRegistrations, hydrateCheckins } from "./syncService";

export const registrationService = {
  listByUser(userId: string): EventRegistration[] {
    return read<EventRegistration>(TABLES.registrations).filter((r) => r.user_id === userId);
  },
  listByEvent(eventId: string): EventRegistration[] {
    return read<EventRegistration>(TABLES.registrations).filter((r) => r.event_id === eventId);
  },
  forUserEvent(userId: string, eventId: string): EventRegistration | null {
    return (
      read<EventRegistration>(TABLES.registrations).find(
        (r) => r.user_id === userId && r.event_id === eventId,
      ) ?? null
    );
  },
  async setState(
    userId: string,
    eventId: string,
    state: ParticipationState,
    bringFriend?: boolean,
  ): Promise<EventRegistration> {
    const payload = {
      user_id: userId,
      event_id: eventId,
      participation_state: state,
      bring_friend: bringFriend ?? state === "Bring a friend",
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("event_registrations")
      .upsert(payload, { onConflict: "event_id,user_id" })
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    await hydrateRegistrations();
    await hydrateEvents(); // recount via trigger
    return data as EventRegistration;
  },
  async cancel(userId: string, eventId: string) {
    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("user_id", userId)
      .eq("event_id", eventId);
    if (error) throw new Error(error.message);
    await hydrateRegistrations();
    await hydrateEvents();
  },
  onChange(cb: () => void) {
    return subscribe(TABLES.registrations, cb);
  },
};

export const checkInService = {
  listByEvent(eventId: string): CheckIn[] {
    return read<CheckIn>(TABLES.checkins).filter((c) => c.event_id === eventId);
  },
  countByEvent(eventId: string): number {
    return checkInService.listByEvent(eventId).length;
  },
  hasUserCheckedIn(userId: string, eventId: string): boolean {
    return read<CheckIn>(TABLES.checkins).some(
      (c) => c.user_id === userId && c.event_id === eventId,
    );
  },
  async create(
    userId: string,
    eventId: string,
    method: CheckIn["method"] = "im_here",
  ): Promise<CheckIn> {
    const { data, error } = await supabase
      .from("check_ins")
      .upsert(
        { user_id: userId, event_id: eventId, method },
        { onConflict: "event_id,user_id" },
      )
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    // mirror checked_in flag on registration
    await supabase
      .from("event_registrations")
      .update({ checked_in: true, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("event_id", eventId);
    await hydrateCheckins();
    await import("./syncService").then((m) => m.hydrateRegistrations());
    return data as CheckIn;
  },
  onChange(cb: () => void) {
    return subscribe(TABLES.checkins, cb);
  },
};

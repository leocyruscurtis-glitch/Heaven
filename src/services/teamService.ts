import { supabase } from "@/integrations/supabase/client";
import { read } from "./db";
import { TABLES, type TeamAssignment, type EventRegistration } from "./types";
import { eventService } from "./eventService";
import { hydrateTeams } from "./syncService";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const teamService = {
  async generate(eventId: string): Promise<TeamAssignment[]> {
    const event = eventService.byId(eventId);
    if (!event || !event.team_based) return [];
    const size = event.team_size ?? 3;
    const regs = read<EventRegistration>(TABLES.registrations).filter(
      (r) =>
        r.event_id === eventId &&
        (r.participation_state === "Join" || r.participation_state === "Bring a friend"),
    );
    const users = shuffle(regs).map((r) => r.user_id);
    const inserts: { event_id: string; team_label: string; user_id: string }[] = [];
    let label = "A";
    while (users.length) {
      const chunk = users.splice(0, size);
      chunk.forEach((uid_) =>
        inserts.push({ event_id: eventId, team_label: `Team ${label}`, user_id: uid_ }),
      );
      label = String.fromCharCode(label.charCodeAt(0) + 1);
    }
    await supabase.from("team_assignments").delete().eq("event_id", eventId);
    if (inserts.length) {
      const { error } = await supabase.from("team_assignments").insert(inserts);
      if (error) throw new Error(error.message);
    }
    await hydrateTeams();
    return read<TeamAssignment>(TABLES.teams).filter((t) => t.event_id === eventId);
  },
  forUser(eventId: string, userId: string): TeamAssignment | null {
    return (
      read<TeamAssignment>(TABLES.teams).find(
        (t) => t.event_id === eventId && t.user_id === userId,
      ) ?? null
    );
  },
  summaryForEvent(eventId: string): { label: string; count: number }[] {
    const teams = read<TeamAssignment>(TABLES.teams).filter((t) => t.event_id === eventId);
    const map = new Map<string, number>();
    teams.forEach((t) => map.set(t.team_label, (map.get(t.team_label) ?? 0) + 1));
    return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
  },
};

// Reads aggregated municipality_metrics from Supabase (cached in db).
// Also computes live overall stats from events/registrations/checkins.

import { read } from "./db";
import { TABLES, type CivicEvent, type EventRegistration, type CheckIn } from "./types";

export type ZoneMetric = {
  zone_id: string;
  event_volume: number;
  attendance_count: number;
  open_spots: number;
  demand_capacity_gap: number;
  hobby_demand_index: number;
  intensity: number;
};

type MetricsRow = {
  zone_id: string;
  event_volume: number;
  attendance_count: number;
  first_time_participant_count: number;
  retention_rate: number;
  hobby_demand_index: Record<string, number>;
  demand_capacity_gap: number;
  anonymized_belonging_score: number;
};

export const municipalityMetricsService = {
  overall() {
    const rows = read<MetricsRow>("municipality_metrics");
    const events = read<CivicEvent>(TABLES.events);
    const regs = read<EventRegistration>(TABLES.registrations);
    const checkins = read<CheckIn>(TABLES.checkins);
    const sum = (k: keyof MetricsRow) =>
      rows.reduce((a, r) => a + (Number(r[k] as unknown as number) || 0), 0);
    return {
      events_this_month: rows.length ? sum("event_volume") : events.length,
      total_attendances: rows.length ? sum("attendance_count") : checkins.length,
      total_registrations: regs.length,
      first_time_percent: rows.length
        ? Math.round((sum("first_time_participant_count") / Math.max(1, sum("attendance_count"))) * 100)
        : 0,
      retention_rate: rows.length
        ? Math.round((rows.reduce((a, r) => a + Number(r.retention_rate || 0), 0) / rows.length) * 100)
        : 0,
      individual_profiles_accessible: 0,
    };
  },
  perZone(): ZoneMetric[] {
    const rows = read<MetricsRow>("municipality_metrics");
    if (rows.length) {
      const maxVolume = Math.max(1, ...rows.map((r) => r.event_volume));
      return rows.map((r) => ({
        zone_id: r.zone_id,
        event_volume: r.event_volume,
        attendance_count: r.attendance_count,
        open_spots: 0,
        demand_capacity_gap: Number(r.demand_capacity_gap || 0),
        hobby_demand_index: Object.values(r.hobby_demand_index || {}).reduce(
          (a: number, b: any) => a + Number(b || 0),
          0,
        ),
        intensity: r.event_volume / maxVolume,
      }));
    }
    return [];
  },
  categoryDemand() {
    const rows = read<MetricsRow>("municipality_metrics");
    const map = new Map<string, { count: number; zone: string }>();
    rows.forEach((r) => {
      Object.entries(r.hobby_demand_index || {}).forEach(([cat, n]) => {
        const prev = map.get(cat) ?? { count: 0, zone: r.zone_id };
        map.set(cat, { count: prev.count + Number(n || 0), zone: r.zone_id });
      });
    });
    return Array.from(map.entries()).map(([cat, v]) => ({
      label: `${cat} demand`,
      zone: v.zone,
      delta: `${v.count} signals`,
    }));
  },
};

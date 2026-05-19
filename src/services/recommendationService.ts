import { eventService, eligibilityReason } from "./eventService";
import type { CivicEvent, User } from "./types";

export const recommendationService = {
  forUser(user: User | null, radiusKm: number): { event: CivicEvent; reason: string }[] {
    if (user?.privacy_settings.pauseRecs) return [];
    const interests = (user?.selected_interests ?? []).map((i) => i.toLowerCase());
    const zone = user?.location_zone_id;
    const all = eventService.list();
    const scored = all
      .filter((e) => e.start_in_min >= 0)
      .filter((e) => eligibilityReason(e, user, radiusKm) === null)
      .map((e) => {
        let score = 0;
        const reasons: string[] = [];
        if (
          interests.length &&
          interests.some(
            (i) =>
              e.category.toLowerCase().includes(i) ||
              e.subcategory.toLowerCase().includes(i) ||
              i.includes(e.category.toLowerCase()),
          )
        ) {
          score += 3;
          reasons.push(`you selected ${e.subcategory.toLowerCase()}`);
        }
        if (interests.length === 0) score += 1;
        if (e.zone_id === zone) {
          score += 2;
          reasons.push("in your neighbourhood");
        }
        if (e.beginner_friendly) {
          score += 1;
          reasons.push("beginner-friendly");
        }
        if (e.distance_km <= radiusKm) {
          score += 1;
          reasons.push(`within ${radiusKm}km`);
        }
        const reason = reasons.length
          ? `Recommended because ${reasons.join(", ")}.`
          : e.recommendation_reason;
        return { event: e, score, reason };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ event, reason }) => ({ event, reason }));
    return scored;
  },
};

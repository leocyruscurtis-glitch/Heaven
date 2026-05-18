import { r as reactExports } from "./server-zgXUd0Aa.js";
import { s as subscribe, T as TABLES, r as read } from "./router-qGr_Hydj.js";
function toLegacyStatus(status) {
  switch (status) {
    case "almost_full":
      return "almost-full";
    case "at_risk_of_cancellation":
      return "at-risk";
    case "cancelled_low_registration":
      return "cancelled";
    case "minimum_reached":
      return "minimum-reached";
    case "open":
    case "completed":
      return "scheduled";
    case "live":
    case "scheduled":
    case "full":
      return status;
    default:
      return "scheduled";
  }
}
function pinFromLatLng(lat, lng) {
  const x = Math.max(12, Math.min(88, 50 + (lng - 4.49) * 900));
  const y = Math.max(12, Math.min(88, 50 - (lat - 51.92) * 1200));
  return { x, y };
}
function toLegacyEvent(event) {
  return {
    id: event.id,
    title: event.title,
    category: event.category,
    subcategory: event.subcategory,
    icon: event.icon,
    description: event.description,
    zoneId: event.zone_id,
    locationName: event.location_name,
    pin: pinFromLatLng(event.lat, event.lng),
    coords: `${event.lat}, ${event.lng}`,
    startTime: event.start_time,
    startInMin: event.start_in_min,
    organiser: event.organiser_name,
    organiserVerified: event.organiser_verified,
    status: toLegacyStatus(event.status),
    isLive: event.is_live,
    minCapacity: event.min_capacity,
    maxCapacity: event.max_capacity,
    currentRegistration: event.current_registration,
    beginnerFriendly: event.beginner_friendly,
    skillLevel: event.skill_level,
    ageRangeMin: event.age_range_min,
    ageRangeMax: event.age_range_max,
    accessibility: event.accessibility_info,
    peopleComeAlone: event.people_usually_come_alone,
    welcomeHost: event.welcome_host_present,
    teamBased: event.team_based,
    teamSize: event.team_size,
    spectatorsAllowed: event.spectators_allowed,
    bringFriendAllowed: event.bring_friend_allowed,
    distanceKm: event.distance_km,
    recommendationReason: event.recommendation_reason,
    whatToBring: event.equipment_needed
  };
}
function useServiceEvents() {
  return reactExports.useSyncExternalStore(
    (cb) => subscribe(TABLES.events, cb) ?? (() => {
    }),
    () => read(TABLES.events),
    () => read(TABLES.events)
  );
}
function useLegacyEvents() {
  const events = useServiceEvents();
  return reactExports.useMemo(() => events.map(toLegacyEvent), [events]);
}
export {
  useLegacyEvents as u
};

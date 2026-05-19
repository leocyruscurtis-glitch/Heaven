import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { seedIfEmpty } from "@/services/seed";
import { authService, initAuthListener } from "@/services/authService";
import { userService } from "@/services/userService";
import { organiserService } from "@/services/organiserService";
import { registrationService, checkInService } from "@/services/registrationService";
import { subscribe, reset as dbReset } from "@/services/db";
import { TABLES, type Session, type User, type Organiser, type ParticipationState } from "@/services/types";

// Backward-compatible facade so existing screens keep working unchanged.
export type Registration = {
  eventId: string;
  state: ParticipationState;
  bringFriend: boolean;
  checkedIn: boolean;
};

type UserPrefsFacade = {
  onboarded: boolean;
  ageRange: any;
  gender: any;
  zoneId: string;
  radiusKm: number;
  interests: string[];
  notifications: Record<string, boolean>;
  accessibility: User["accessibility_preferences"];
  privacy: User["privacy_settings"];
  organiserVerified: boolean;
};

type Ctx = {
  // session
  session: Session | null;
  user: User | null;
  organiser: Organiser | null;
  signOut: () => void;
  // facade
  prefs: UserPrefsFacade;
  setPrefs: (p: Partial<UserPrefsFacade>) => void;
  registrations: Registration[];
  setRegistration: (
    eventId: string,
    state: ParticipationState,
    opts?: { bringFriend?: boolean },
  ) => void;
  checkIn: (eventId: string) => void;
  resetAll: () => void;
  deleteMyData: () => void;
  // re-render token
  tick: number;
};

const AppContext = createContext<Ctx | null>(null);

const DEFAULT_PREFS: UserPrefsFacade = {
  onboarded: false,
  ageRange: null,
  gender: null,
  zoneId: "kralingen",
  radiusKm: 2,
  interests: [],
  notifications: { nearby: true, recommended: true, startingSoon: true, quiet: false, team: true, weekend: true },
  accessibility: { fontScale: 1, reducedMotion: false, highContrast: false, colorblind: false },
  privacy: { pauseRecs: false, hideFromMatching: false },
  organiserVerified: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [tick, setTick] = useState(0);
  const bump = () => setTick((t) => t + 1);

  useEffect(() => {
    seedIfEmpty();
    initAuthListener();
    setHydrated(true);
    const offs = [
      subscribe(TABLES.session, bump),
      subscribe(TABLES.users, bump),
      subscribe(TABLES.organisers, bump),
      subscribe(TABLES.registrations, bump),
      subscribe(TABLES.checkins, bump),
      subscribe(TABLES.events, bump),
      subscribe(TABLES.verification, bump),
      subscribe(TABLES.aiProposals, bump),
    ];
    return () => offs.forEach((o) => o && o());
  }, []);

  const session = hydrated ? authService.getSession() : null;
  const user = session?.role === "resident" ? userService.getById(session.profile_id) : null;
  const organiser = session?.role === "organiser" ? organiserService.getById(session.profile_id) : null;

  const prefs: UserPrefsFacade = user
    ? {
        onboarded: user.onboarding_complete,
        ageRange: user.age_range,
        gender: user.gender_optional as any,
        zoneId: user.location_zone_id,
        radiusKm: user.radius_km,
        interests: user.selected_interests,
        notifications: user.notification_preferences,
        accessibility: user.accessibility_preferences,
        privacy: user.privacy_settings,
        organiserVerified: organiser?.verification_status === "verified",
      }
    : { ...DEFAULT_PREFS, organiserVerified: organiser?.verification_status === "verified" };

  const setPrefs = (p: Partial<UserPrefsFacade>) => {
    if (!user) return;
    const patch: Partial<User> = {};
    if (p.onboarded !== undefined) patch.onboarding_complete = p.onboarded;
    if (p.ageRange !== undefined) patch.age_range = p.ageRange;
    if (p.gender !== undefined) patch.gender_optional = p.gender;
    if (p.zoneId !== undefined) patch.location_zone_id = p.zoneId;
    if (p.radiusKm !== undefined) patch.radius_km = p.radiusKm;
    if (p.interests !== undefined) patch.selected_interests = p.interests;
    if (p.notifications !== undefined) patch.notification_preferences = p.notifications;
    if (p.accessibility !== undefined) patch.accessibility_preferences = p.accessibility;
    if (p.privacy !== undefined) patch.privacy_settings = p.privacy;
    userService.update(user.id, patch);
    if (p.organiserVerified && organiser) organiserService.markVerified(organiser.id);
  };

  const registrations: Registration[] = user
    ? registrationService.listByUser(user.id).map((r) => ({
        eventId: r.event_id,
        state: r.participation_state,
        bringFriend: !!r.bring_friend,
        checkedIn: r.checked_in,
      }))
    : [];

  const setRegistration = (
    eventId: string,
    state: ParticipationState,
    opts?: { bringFriend?: boolean },
  ) => {
    if (!user) return;
    try {
      registrationService.setState(user.id, eventId, state, opts?.bringFriend);
    } catch (e) {
      console.warn(e);
    }
  };

  // Apply accessibility preferences globally to <html>
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const a = prefs.accessibility;
    root.dataset.reducedMotion = a.reducedMotion ? "true" : "false";
    root.dataset.highContrast = a.highContrast ? "true" : "false";
    root.dataset.colorblind = a.colorblind ? "true" : "false";
    root.style.fontSize = `${Math.round(a.fontScale * 16)}px`;
    return () => {
      root.style.fontSize = "";
    };
  }, [prefs.accessibility.reducedMotion, prefs.accessibility.highContrast, prefs.accessibility.colorblind, prefs.accessibility.fontScale]);

  const checkIn = (eventId: string) => {
    if (!user) return;
    checkInService.create(user.id, eventId, "im_here");
  };

  return (
    <AppContext.Provider
      value={{
        session,
        user,
        organiser,
        signOut: () => authService.signOut(),
        prefs,
        setPrefs,
        registrations,
        setRegistration,
        checkIn,
        resetAll: () => {
          dbReset();
          seedIfEmpty();
        },
        deleteMyData: () => {
          if (user) {
            userService.deleteUserData(user.id);
            authService.signOut();
          }
        },
        tick,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

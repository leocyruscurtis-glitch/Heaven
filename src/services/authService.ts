// Supabase Auth wrapper. Session is derived from supabase.auth, profile_id
// from the corresponding profile row.

import { supabase } from "@/integrations/supabase/client";
import { read, write, subscribe } from "./db";
import { TABLES, type Session, type User, type Organiser, type MunicipalityAdmin } from "./types";
import {
  hydrateAdmin,
  hydrateForSession,
  hydrateOrganiser,
  hydrateUser,
} from "./syncService";

let cachedSession: Session | null = null;

function setSession(s: Session | null) {
  cachedSession = s;
  write(TABLES.session, s ? [s] : []);
}

async function resolveSession(authUserId: string): Promise<Session | null> {
  // try each profile table in order
  const u = await hydrateUser(authUserId);
  if (u) return { auth_user_id: authUserId, role: "resident", profile_id: (u as unknown as User).id };
  const o = await hydrateOrganiser(authUserId);
  if (o) return { auth_user_id: authUserId, role: "organiser", profile_id: (o as unknown as Organiser).id };
  const a = await hydrateAdmin(authUserId);
  if (a)
    return {
      auth_user_id: authUserId,
      role: "municipality_admin",
      profile_id: (a as unknown as MunicipalityAdmin).id,
    };
  return null;
}

async function refreshFromSupabase() {
  const { data } = await supabase.auth.getSession();
  const authUser = data.session?.user;
  if (!authUser) {
    setSession(null);
    await hydrateForSession(null);
    return;
  }
  const session = await resolveSession(authUser.id);
  setSession(session);
  await hydrateForSession(session);
}

// Wire onAuthStateChange exactly once.
let wired = false;
export function initAuthListener() {
  if (wired || typeof window === "undefined") return;
  wired = true;
  supabase.auth.onAuthStateChange((_event, _session) => {
    // defer to avoid deadlocks (Supabase recommendation)
    setTimeout(() => {
      refreshFromSupabase();
    }, 0);
  });
  refreshFromSupabase();
}

export const authService = {
  getSession(): Session | null {
    return cachedSession ?? read<Session>(TABLES.session)[0] ?? null;
  },
  onChange(cb: () => void) {
    return subscribe(TABLES.session, cb);
  },

  async signUpResident(input: { email: string; password: string }): Promise<Session> {
    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { role: "resident" },
      },
    });
    if (error) throw new Error(error.message);
    await refreshFromSupabase();
    const s = authService.getSession();
    if (!s) throw new Error("Sign-up succeeded but session could not be created.");
    return s;
  },

  async signUpOrganiser(input: {
    email: string;
    password: string;
    name: string;
    type: Organiser["type"];
    zoneId: string;
    phone?: string;
  }): Promise<Session> {
    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/organiser`,
        data: {
          role: "organiser",
          name: input.name,
          type: input.type,
          zone_id: input.zoneId,
          phone: input.phone ?? null,
        },
      },
    });
    if (error) throw new Error(error.message);
    await refreshFromSupabase();
    const s = authService.getSession();
    if (!s) throw new Error("Sign-up succeeded but session could not be created.");
    return s;
  },

  async signUpAdmin(input: { email: string; password: string; name?: string }): Promise<Session> {
    const { error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/municipality`,
        data: { role: "municipality_admin", name: input.name ?? "Municipality admin" },
      },
    });
    if (error) throw new Error(error.message);
    await refreshFromSupabase();
    const s = authService.getSession();
    if (!s) throw new Error("Sign-up succeeded but session could not be created.");
    return s;
  },

  // Demo admin shortcut: signs in with a fixed account (created on first use)
  async signInAdmin(): Promise<Session> {
    const email = "admin@rotterdam.nl";
    const password = "admin-demo-pass";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // create on first use
      const { error: e2 } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/municipality`,
          data: { role: "municipality_admin", name: "Gemeente Rotterdam" },
        },
      });
      if (e2) throw new Error(e2.message);
    }
    await refreshFromSupabase();
    const s = authService.getSession();
    if (!s) throw new Error("Admin session could not be created.");
    return s;
  },

  async signIn(email: string, password: string): Promise<Session> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    await refreshFromSupabase();
    const s = authService.getSession();
    if (!s) throw new Error("Sign-in succeeded but no profile is linked to this account.");
    return s;
  },

  async signOut() {
    await supabase.auth.signOut();
    setSession(null);
    await hydrateForSession(null);
  },

  currentRole() {
    return cachedSession?.role ?? null;
  },
};

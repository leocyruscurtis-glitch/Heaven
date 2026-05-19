import { supabase } from "@/integrations/supabase/client";
import { read, write, subscribe } from "./db";
import { TABLES, type User } from "./types";
import { hydrateUser } from "./syncService";
import { authService } from "./authService";

export const userService = {
  getById(id: string): User | null {
    return read<User>(TABLES.users).find((u) => u.id === id) ?? null;
  },
  getByAuthId(authId: string): User | null {
    return read<User>(TABLES.users).find((u) => u.auth_user_id === authId) ?? null;
  },
  async update(id: string, partial: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .update({ ...partial, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) write(TABLES.users, [data as unknown as User]);
    return (data as unknown as User) ?? null;
  },
  async completeOnboarding(id: string, data: Partial<User>) {
    return userService.update(id, { ...data, onboarding_complete: true });
  },
  async deleteUserData(_id: string) {
    // Soft delete: just sign out. Cascade deletion of auth.user requires admin key.
    await authService.signOut();
  },
  async refresh() {
    const s = authService.getSession();
    if (s?.role === "resident") await hydrateUser(s.auth_user_id);
  },
  onChange(cb: () => void) {
    return subscribe(TABLES.users, cb);
  },
};

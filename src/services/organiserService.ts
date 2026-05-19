import { supabase } from "@/integrations/supabase/client";
import { read, write, subscribe } from "./db";
import { TABLES, type Organiser, type VerificationSteps } from "./types";

export const organiserService = {
  getById(id: string): Organiser | null {
    return read<Organiser>(TABLES.organisers).find((o) => o.id === id) ?? null;
  },
  getByAuthId(authId: string): Organiser | null {
    return read<Organiser>(TABLES.organisers).find((o) => o.auth_user_id === authId) ?? null;
  },
  async update(id: string, partial: Partial<Organiser>): Promise<Organiser | null> {
    const { data, error } = await supabase
      .from("organisers")
      .update({ ...partial, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) write(TABLES.organisers, [data as Organiser]);
    return (data as Organiser) ?? null;
  },
  async markVerified(id: string) {
    return organiserService.update(id, { verification_status: "verified" });
  },
  onChange(cb: () => void) {
    return subscribe(TABLES.organisers, cb);
  },
};

const STEP_KEYS: (keyof VerificationSteps)[] = [
  "email_verified",
  "phone_verified",
  "id_verified",
  "vog_status",
  "kvk_status",
  "ubo_status",
  "municipality_token_status",
  "iban_status",
  "btw_status",
];

function computeOverall(s: VerificationSteps) {
  const done = STEP_KEYS.filter((k) => !!s[k]).length;
  if (done === 0) return "not_started" as const;
  if (done < STEP_KEYS.length) return "in_progress" as const;
  return "awaiting_review" as const;
}

export const verificationService = {
  getForOrganiser(organiserId: string): VerificationSteps | null {
    return (
      read<VerificationSteps>(TABLES.verification).find((s) => s.organiser_id === organiserId) ??
      null
    );
  },
  async toggleStep(organiserId: string, key: keyof VerificationSteps) {
    const cur = verificationService.getForOrganiser(organiserId);
    if (!cur) return null;
    const next = { ...cur, [key]: !cur[key] } as VerificationSteps;
    next.overall_status = computeOverall(next);
    const update: Record<string, any> = {
      [key as string]: next[key],
      overall_status: next.overall_status,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from("organiser_verification_steps")
      .update(update)
      .eq("organiser_id", organiserId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) write(TABLES.verification, [data as VerificationSteps]);
    return data as VerificationSteps;
  },
  async submitForReview(organiserId: string) {
    const { data, error } = await supabase
      .from("organiser_verification_steps")
      .update({ overall_status: "verified", updated_at: new Date().toISOString() })
      .eq("organiser_id", organiserId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) write(TABLES.verification, [data as VerificationSteps]);
    await organiserService.markVerified(organiserId);
    return data as VerificationSteps;
  },
  onChange(cb: () => void) {
    return subscribe(TABLES.verification, cb);
  },
};

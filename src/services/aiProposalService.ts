import { supabase } from "@/integrations/supabase/client";
import { read, subscribe } from "./db";
import { TABLES, type AiProposal } from "./types";
import { eventService } from "./eventService";
import { organiserService } from "./organiserService";
import { hydrateAiProposals } from "./syncService";

export const aiProposalService = {
  list(): AiProposal[] {
    return read<AiProposal>(TABLES.aiProposals);
  },
  async approve(id: string, organiserId: string) {
    const p = read<AiProposal>(TABLES.aiProposals).find((x) => x.id === id);
    if (!p) return;
    const org = organiserService.getById(organiserId);
    await eventService.create(organiserId, org?.name ?? "Verified organiser", {
      title: `${p.detected_theme} — community pickup`,
      category: p.detected_theme,
      subcategory: p.detected_theme,
      icon: "✨",
      description: p.proposal_reason,
      zone_id: p.zone_id,
      location_name: p.suggested_location_name,
      lat: p.suggested_lat,
      lng: p.suggested_lng,
      start_time: p.suggested_start_time,
      start_in_min: 120,
      min_capacity: 4,
      max_capacity: 12,
      beginner_friendly: true,
      recommendation_reason: p.proposal_reason,
    });
    await supabase
      .from("ai_event_proposals")
      .update({ status: "published", organiser_id: organiserId })
      .eq("id", id);
    await hydrateAiProposals();
  },
  async reject(id: string) {
    await supabase.from("ai_event_proposals").update({ status: "rejected" }).eq("id", id);
    await hydrateAiProposals();
  },
  onChange(cb: () => void) {
    return subscribe(TABLES.aiProposals, cb);
  },
};

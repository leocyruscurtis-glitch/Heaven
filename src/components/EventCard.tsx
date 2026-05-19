import { Link } from "@tanstack/react-router";
import { ShieldCheck, Users, Sparkles, Accessibility } from "lucide-react";
import type { CivicEvent } from "@/lib/mock-data";

function StatusPill({ status }: { status: CivicEvent["status"] }) {
  const map: Record<CivicEvent["status"], { label: string; cls: string }> = {
    live: { label: "Live now", cls: "bg-turquoise text-white" },
    scheduled: { label: "Scheduled", cls: "bg-forest/5 text-forest" },
    "almost-full": { label: "Almost full", cls: "bg-amber-100 text-amber-800" },
    full: { label: "Full", cls: "bg-forest/10 text-forest" },
    "at-risk": { label: "At risk", cls: "bg-red-50 text-boundary" },
    cancelled: { label: "Cancelled", cls: "bg-boundary/10 text-boundary" },
    "minimum-reached": { label: "Min reached", cls: "bg-success/15 text-forest" },
  };
  const v = map[status];
  return (
    <span
      data-status-label={v.label}
      className={`text-[10px] font-semibold px-2 py-1 rounded-md ${v.cls}`}
    >
      {v.label}
    </span>
  );
}

export function EventCard({ event, withReason = true }: { event: CivicEvent; withReason?: boolean }) {
  return (
    <Link
      to="/event/$id"
      params={{ id: event.id }}
      className="card-soft block p-4 active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl w-10 h-10 rounded-xl bg-canvas flex items-center justify-center shrink-0">
          {event.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[17px] font-semibold leading-tight text-forest">{event.title}</h2>
            <StatusPill status={event.status} />
          </div>
          <p className="text-[13px] text-[#374151] mt-1">
            {event.startTime} · {event.locationName} · {event.distanceKm}km
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {event.beginnerFriendly && (
              <span className="text-[11px] px-2 py-1 rounded-md bg-success/10 text-forest font-medium">
                Beginner-friendly
              </span>
            )}
            <span className="text-[11px] px-2 py-1 rounded-md bg-canvas text-forest font-medium">
              {event.maxCapacity - event.currentRegistration} open spots
            </span>
            {event.peopleComeAlone && (
              <span className="text-[11px] px-2 py-1 rounded-md bg-canvas text-forest font-medium inline-flex items-center gap-1">
                <Users size={11} /> often solo
              </span>
            )}
            {event.welcomeHost && (
              <span className="text-[11px] px-2 py-1 rounded-md bg-canvas text-forest font-medium inline-flex items-center gap-1">
                <Sparkles size={11} /> welcome host
              </span>
            )}
            {event.organiserVerified && (
              <span className="text-[11px] px-2 py-1 rounded-md bg-turquoise/10 text-forest font-medium inline-flex items-center gap-1">
                <ShieldCheck size={11} /> verified
              </span>
            )}
            {event.accessibility && (
              <span className="text-[11px] px-2 py-1 rounded-md bg-canvas text-forest font-medium inline-flex items-center gap-1">
                <Accessibility size={11} /> accessible
              </span>
            )}
          </div>
          {withReason && (
            <p className="micro-label mt-3 normal-case tracking-normal text-[11px] opacity-60">
              {event.recommendationReason}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

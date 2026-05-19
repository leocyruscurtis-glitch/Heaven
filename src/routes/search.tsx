import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { MobileShell } from "@/components/MobileShell";
import { EventCard } from "@/components/EventCard";
import { events, zones } from "@/lib/mock-data";
import { useApp } from "@/lib/app-store";
import { ArrowLeft } from "lucide-react";

const schema = z.object({ q: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: () => ({ meta: [{ title: "Search — Haven" }, { name: "description", content: "Search results split by radius." }] }),
  component: SearchResults,
});

function SearchResults() {
  const { q } = Route.useSearch();
  const { prefs } = useApp();
  const zone = zones.find((z) => z.id === prefs.zoneId)!;

  const matches = events.filter((e) => {
    if (!q) return true;
    const haystack = `${e.title} ${e.category} ${e.subcategory}`.toLowerCase();
    return haystack.includes(q.toLowerCase());
  });
  const inside = matches.filter((e) => e.zoneId === prefs.zoneId);
  const outside = matches.filter((e) => e.zoneId !== prefs.zoneId);

  return (
    <MobileShell>
      <div className="px-4 pt-5 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <Link to="/" className="text-forest p-2 -ml-2"><ArrowLeft size={20} /></Link>
          <div>
            <p className="micro-label">Results</p>
            <h1 className="text-[22px] font-bold leading-tight">{q || "All events"}</h1>
          </div>
        </div>

        <p className="micro-label mb-3">Inside your current radius — {zone.name}</p>
        <div className="space-y-3">
          {inside.length === 0 && <Empty text="Nothing here yet. Try widening your radius." />}
          {inside.map((e) => <EventCard key={e.id} event={e} />)}
        </div>

        <p className="micro-label mt-7 mb-3">Outside your current radius</p>
        <div className="space-y-3">
          {outside.length === 0 && <Empty text="No nearby alternatives matched." />}
          {outside.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </div>
    </MobileShell>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="card-soft p-5 text-center text-[13px] text-forest/60">{text}</div>;
}

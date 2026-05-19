import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { EventCard } from "@/components/EventCard";
import { events } from "@/lib/mock-data";
import { useApp } from "@/lib/app-store";
import { useSearchedLocation, distanceKm } from "@/lib/search-location";
import { zones } from "@/lib/mock-data";
import { Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Events — Haven" }, { name: "description", content: "Personal recommendations and nearby events." }] }),
  component: EventsTab,
});

const PAGE = 4;

function EventsTab() {
  const { prefs } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(PAGE);
  const searched = useSearchedLocation();

  const center = searched
    ? { lat: searched.lat, lng: searched.lng }
    : (() => {
        const z = zones.find((z) => z.id === prefs.zoneId) ?? zones[0];
        return { lat: z.center[0], lng: z.center[1] };
      })();

  const recommended = useMemo(() => {
    if (prefs.privacy.pauseRecs) return [];
    const userInterests = prefs.interests.map((i) => i.toLowerCase());
    return events
      .filter((e) => e.startInMin >= 0)
      .map((e) => {
        const [lat, lng] = e.coords.split(",").map((s) => parseFloat(s.trim()));
        const d = distanceKm(center, { lat, lng });
        let score = 0;
        if (userInterests.length === 0) score = 1;
        if (
          userInterests.some(
            (i) =>
              e.category.toLowerCase().includes(i) ||
              e.subcategory.toLowerCase().includes(i) ||
              i.includes(e.category.toLowerCase()),
          )
        )
          score += 3;
        if (d <= prefs.radiusKm) score += 2;
        if (e.beginnerFriendly) score += 1;
        const openSpots = e.maxCapacity - e.currentRegistration;
        if (openSpots > 0) score += 1;
        if (openSpots <= 0 || e.status === "full") score -= 10;
        // earlier events first
        score += Math.max(0, 5 - e.startInMin / (60 * 24));
        return { e, score, d };
      })
      .filter((x) => x.score > -100)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.e);
  }, [prefs, center.lat, center.lng]);

  const suggestions = useMemo(() => {
    if (!q) return [];
    const opts = [...new Set(events.flatMap((e) => [e.category, e.subcategory, e.locationName]))];
    return opts.filter((o) => o.toLowerCase().startsWith(q.toLowerCase())).slice(0, 4);
  }, [q]);

  const results = useMemo(() => {
    if (!q) return [];
    const h = q.toLowerCase();
    return events.filter((e) => `${e.title} ${e.category} ${e.subcategory} ${e.locationName}`.toLowerCase().includes(h));
  }, [q]);

  const visibleRecs = recommended.slice(0, visible);
  const canShowMore = recommended.length > visible;

  return (
    <MobileShell>
      <div className="px-4 pt-6 pb-6">
        <h1 className="text-[24px] font-bold">Events</h1>
        <p className="text-[14px] text-[#374151] mt-1">Tailored to your preferences. Tap to see details.</p>

        <div className="card-soft mt-5 p-2 bg-white">
          <div className="flex items-center gap-2 px-2">
            <Search size={16} className="text-forest/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && q && nav({ to: "/search", search: { q } })}
              placeholder="Search location, hobby, or category"
              className="flex-1 py-2.5 text-[14px] outline-none bg-transparent placeholder:text-forest/40"
            />
          </div>
          {suggestions.length > 0 && (
            <div className="border-t border-border mt-1 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQ(""); nav({ to: "/search", search: { q: s } }); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-canvas text-[14px] text-forest"
                >{s}</button>
              ))}
            </div>
          )}
        </div>

        {q && results.length > 0 && (
          <section className="mt-6">
            <p className="micro-label mb-3">Matching "{q}"</p>
            <div className="space-y-3">
              {results.slice(0, 6).map((e) => <EventCard key={e.id} event={e} withReason={false} />)}
            </div>
          </section>
        )}

        <section className="mt-6">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={14} className="text-turquoise" />
            <p className="micro-label">Recommended for you</p>
          </div>
          {prefs.privacy.pauseRecs ? (
            <div className="card-soft p-5 text-center text-[13px] text-forest/60">
              Recommendations are paused. You can still search events manually.
            </div>
          ) : recommended.length === 0 ? (
            <div className="card-soft p-5 text-center text-[13px] text-forest/60">
              Add interests in Settings to get recommendations.
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {visibleRecs.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
              {canShowMore && (
                <button
                  onClick={() => setVisible((v) => v + PAGE)}
                  className="mt-3 w-full py-3 rounded-xl bg-canvas text-forest font-semibold text-[13px]"
                >
                  Show more events ({recommended.length - visible} left)
                </button>
              )}
            </>
          )}
        </section>

        {/* Privacy reminder card */}
        <div className="card-soft mt-6 p-4 bg-success/5">
          <p className="text-[12px] font-semibold text-forest">Why are these shown?</p>
          <p className="text-[12px] text-[#374151] mt-1 leading-relaxed">
            We only use the preferences you choose. No public profiles, no ratings, and no open chats.
            Manage anytime in Settings.
          </p>
        </div>
      </div>
    </MobileShell>
  );
}

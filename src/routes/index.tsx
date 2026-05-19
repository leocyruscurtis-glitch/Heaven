import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { GoogleEventMap } from "@/components/GoogleEventMap";
import { useApp } from "@/lib/app-store";
import { events, zones } from "@/lib/mock-data";
import {
  useSearchedLocation,
  setSearchedLocation,
  distanceKm,
} from "@/lib/search-location";
import {
  Search,
  MapPin,
  X,
  ShieldCheck,
  Info as InfoIcon,
  Users,
  LocateFixed,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Map — Haven" },
      { name: "description", content: "Live map of nearby civic activities in your zone." },
    ],
  }),
  component: MapHome,
});

const RADIUS_OPTIONS = [1, 2, 5, 10, 20] as const;

function MapHome() {
  const { prefs, setPrefs, session } = useApp();
  const nav = useNavigate();
  const [locOpen, setLocOpen] = useState(false);
  const [radiusOpen, setRadiusOpen] = useState(false);
  const [hobbyQ, setHobbyQ] = useState("");
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const searched = useSearchedLocation();

  useEffect(() => {
    if (!session) nav({ to: "/login" });
    else if (session.role === "resident" && !prefs.onboarded) nav({ to: "/onboarding" });
    else if (session.role === "municipality_admin") nav({ to: "/municipality" });
  }, [session, prefs.onboarded, nav]);

  const zone = zones.find((z) => z.id === prefs.zoneId) ?? zones[0];
  const effectiveCenter = searched
    ? { lat: searched.lat, lng: searched.lng }
    : { lat: zone.center[0], lng: zone.center[1] };

  const zoneEvents = useMemo(() => {
    return events.filter((e) => {
      const [lat, lng] = e.coords.split(",").map((s) => parseFloat(s.trim()));
      const d = distanceKm(effectiveCenter, { lat, lng });
      return d <= prefs.radiusKm;
    });
  }, [effectiveCenter.lat, effectiveCenter.lng, prefs.radiusKm]);

  const selectedEvent = zoneEvents.find((e) => e.id === selectedPin);

  const submitHobby = (q: string) => {
    if (!q.trim()) return;
    nav({ to: "/search", search: { q: q.trim() } });
  };

  return (
    <MobileShell>
      <div className="relative h-dvh">
        <div className="absolute inset-0 pb-[88px]">
          <GoogleEventMap
            events={zoneEvents}
            zone={zone}
            radiusKm={prefs.radiusKm}
            center={effectiveCenter}
            selectedId={selectedPin}
            onPinClick={setSelectedPin}
            reducedMotion={prefs.accessibility.reducedMotion}
          />
        </div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-5 flex items-center gap-2 z-20">
          <div className="card-soft flex-1 px-3.5 py-2.5 flex items-center gap-2 min-w-0">
            <MapPin size={16} className="text-turquoise shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-forest/50 leading-none uppercase tracking-wider font-semibold">
                {searched ? "Searched location" : "Your zone"}
              </p>
              <p className="text-[14px] text-forest font-semibold leading-tight mt-0.5 truncate">
                {searched ? searched.label : zone.name}
              </p>
            </div>
            <button
              onClick={() => setRadiusOpen((v) => !v)}
              className="text-[11px] px-2 py-1 rounded-md bg-boundary/10 text-boundary font-semibold shrink-0"
              aria-label="Change radius"
            >
              {prefs.radiusKm}km
            </button>
            {searched && (
              <button
                onClick={() => setSearchedLocation(null)}
                className="text-forest/50 shrink-0 -mr-1"
                aria-label="Clear searched location"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setLocOpen(true)}
            className="card-soft w-11 h-11 flex items-center justify-center bg-white shrink-0"
            aria-label="Change location"
          >
            <Search size={18} className="text-forest" />
          </button>
        </div>

        {/* Radius popover */}
        {radiusOpen && (
          <div className="absolute top-[78px] left-4 right-16 z-30 card-soft bg-white p-2 flex gap-1.5">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setPrefs({ radiusKm: r });
                  setRadiusOpen(false);
                }}
                className={`flex-1 text-[12px] py-2 rounded-lg font-semibold ${
                  prefs.radiusKm === r ? "bg-turquoise text-white" : "bg-canvas text-forest"
                }`}
              >
                {r}km
              </button>
            ))}
          </div>
        )}

        {/* Hobby search */}
        {!selectedEvent && (
          <div className="absolute bottom-[104px] left-4 right-4 z-20">
            <HobbySearch value={hobbyQ} onChange={setHobbyQ} onSubmit={submitHobby} />
          </div>
        )}

        {/* Selected event detail card */}
        {selectedEvent && (
          <div className="absolute bottom-[100px] left-3 right-3 z-30 animate-in fade-in slide-in-from-bottom-4">
            <EventDetailCard
              event={selectedEvent}
              onClose={() => setSelectedPin(null)}
              onLearnMore={() =>
                nav({ to: "/event/$id", params: { id: selectedEvent.id } })
              }
              onJoin={() =>
                nav({
                  to: "/event/$id",
                  params: { id: selectedEvent.id },
                  search: { action: "join" } as any,
                })
              }
            />
          </div>
        )}

        {locOpen && (
          <LocationOverlay
            onClose={() => setLocOpen(false)}
            currentCenter={effectiveCenter}
          />
        )}
      </div>
    </MobileShell>
  );
}

function EventDetailCard({
  event,
  onClose,
  onLearnMore,
  onJoin,
}: {
  event: (typeof events)[number];
  onClose: () => void;
  onLearnMore: () => void;
  onJoin: () => void;
}) {
  const [lat, lng] = event.coords.split(",").map((s) => parseFloat(s.trim()));
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const openSpots = event.maxCapacity - event.currentRegistration;
  const isFull = openSpots <= 0;

  return (
    <div className="card-soft p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl w-11 h-11 rounded-xl bg-canvas flex items-center justify-center shrink-0">
          {event.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h2 className="text-[17px] font-semibold leading-tight">{event.title}</h2>
            <button onClick={onClose} className="text-forest/40 -mt-1 -mr-1 p-1" aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <p className="text-[13px] text-[#374151] mt-1">
            {event.startTime} ·{" "}
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-turquoise underline-offset-2 hover:underline"
            >
              {event.locationName}
            </a>
          </p>
          <p className="text-[12px] text-forest/60 mt-0.5">
            {event.organiser} ·{" "}
            {isFull ? <span className="text-boundary font-semibold">Full</span> : `${openSpots} open`}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {event.beginnerFriendly && <Chip>Beginner-friendly</Chip>}
            {event.organiserVerified && <Chip icon={<ShieldCheck size={11} />}>Verified</Chip>}
            {event.welcomeHost && <Chip icon={<Users size={11} />}>Welcome host</Chip>}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={onLearnMore}
              className="bg-canvas text-forest font-semibold py-2.5 rounded-xl text-[13px] inline-flex items-center justify-center gap-1.5"
            >
              <InfoIcon size={14} /> Learn more
            </button>
            <button
              onClick={onJoin}
              disabled={isFull}
              className="bg-turquoise text-white font-semibold py-2.5 rounded-xl text-[13px] disabled:opacity-50"
            >
              {isFull ? "Full" : "Join"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="text-[11px] px-2 py-1 rounded-md bg-success/10 text-forest font-medium inline-flex items-center gap-1">
      {icon}
      {children}
    </span>
  );
}

function HobbySearch({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
}) {
  const allHobbies = [
    "Basketball", "Football", "Walking", "Running", "Board Games",
    "Quiet reading", "Cooking", "Salsa", "Karaoke", "Book club",
  ];
  const matches = value
    ? allHobbies.filter((h) => h.toLowerCase().startsWith(value.toLowerCase())).slice(0, 4)
    : [];
  return (
    <div className="card-soft p-2 bg-white">
      <div className="flex items-center gap-2 px-2">
        <Search size={16} className="text-forest/50" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit(value)}
          placeholder="Search a hobby (e.g. basketball)"
          className="flex-1 py-2.5 text-[14px] outline-none bg-transparent placeholder:text-forest/40"
        />
      </div>
      {matches.length > 0 && (
        <div className="border-t border-border mt-1 pt-1">
          {matches.map((m) => (
            <button
              key={m}
              onClick={() => {
                onChange("");
                onSubmit(m);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-canvas text-[14px] text-forest"
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type PlaceSuggestion = { placeId: string; primaryText: string; secondaryText: string };

function LocationOverlay({
  onClose,
  currentCenter,
}: {
  onClose: () => void;
  currentCenter: { lat: number; lng: number };
}) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<number | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setSuggestions([]);
      setErr(null);
      return;
    }
    if (debounce.current) window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch("/api/places/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: q,
            bias: { lat: currentCenter.lat, lng: currentCenter.lng, radius: 20000 },
          }),
        });
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        if (data.error) setErr("No suggestions — try a broader area.");
      } catch {
        setErr("Couldn't load suggestions. Try again.");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      if (debounce.current) window.clearTimeout(debounce.current);
    };
  }, [q, currentCenter.lat, currentCenter.lng]);

  const pickSuggestion = async (s: PlaceSuggestion) => {
    try {
      const res = await fetch("/api/places/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: s.placeId }),
      });
      const data = await res.json();
      if (data.lat != null && data.lng != null) {
        setSearchedLocation({
          lat: data.lat,
          lng: data.lng,
          label: s.primaryText || data.label,
        });
        onClose();
      } else {
        setErr("Couldn't pick that place. Try another.");
      }
    } catch {
      setErr("Couldn't pick that place. Try another.");
    }
  };

  const useMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setErr("Location not available on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setSearchedLocation({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          label: "Your current location",
        });
        onClose();
      },
      () => setErr("Location permission denied."),
      { timeout: 8000 },
    );
  };

  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col">
      <div className="p-4 pt-5 flex items-center gap-3 border-b border-border">
        <button onClick={onClose} className="text-forest p-2 -ml-2" aria-label="Back">
          <X size={22} />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-canvas rounded-xl px-3 py-2.5">
          <Search size={16} className="text-forest/50" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Neighbourhood, street, or landmark"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-forest/40"
          />
        </div>
      </div>
      <button
        onClick={useMyLocation}
        className="mx-3 mt-3 flex items-center gap-2 px-4 py-3 rounded-xl bg-turquoise/10 text-forest font-medium text-[14px]"
      >
        <LocateFixed size={16} className="text-turquoise" /> Use my current location
      </button>
      <div className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider text-forest/50 font-semibold">
        {loading ? "Searching…" : "Suggestions"}
      </div>
      <div className="flex-1 overflow-auto p-3 pt-0">
        {err && <p className="px-3 py-2 text-[13px] text-forest/60">{err}</p>}
        {!err && !loading && q && suggestions.length === 0 && (
          <p className="px-3 py-2 text-[13px] text-forest/60">No matches yet — keep typing.</p>
        )}
        {suggestions.map((s) => (
          <button
            key={s.placeId}
            onClick={() => pickSuggestion(s)}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-canvas flex flex-col"
          >
            <span className="text-forest font-medium text-[14px]">{s.primaryText}</span>
            {s.secondaryText && (
              <span className="text-[12px] text-forest/55 mt-0.5">{s.secondaryText}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

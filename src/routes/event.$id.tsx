import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { events, type ParticipationState } from "@/lib/mock-data";
import { useApp } from "@/lib/app-store";
import {
  ArrowLeft, Clock, MapPin, Users, ShieldCheck, Sparkles, Accessibility,
  HandHeart, CalendarClock, UserPlus, Eye, Check, QrCode, Flag, ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/event/$id")({
  head: ({ params }) => {
    const e = events.find((x) => x.id === params.id);
    return {
      meta: [
        { title: e ? `${e.title} — Haven` : "Event — Haven" },
        { name: "description", content: e?.description ?? "Civic event details." },
      ],
    };
  },
  validateSearch: (s: Record<string, unknown>) => ({
    action: s.action === "join" ? "join" : undefined,
  }),
  component: EventDetail,
  notFoundComponent: () => (
    <MobileShell><div className="p-8 text-center">Event not found. <Link to="/events" className="text-turquoise">Back to events</Link></div></MobileShell>
  ),
});

type MainState = Exclude<ParticipationState, "Bring a friend">;

const MAIN: { state: MainState; icon: any; sub: string }[] = [
  { state: "Join", icon: Check, sub: "You’re in. Arrival help will appear before the event." },
  { state: "Interested", icon: HandHeart, sub: "Saved. We’ll keep this visible for you." },
  { state: "Maybe", icon: Sparkles, sub: "No pressure. We’ll remind you later." },
  { state: "Remind me later", icon: CalendarClock, sub: "We’ll nudge you closer to the time." },
  { state: "Spectator", icon: Eye, sub: "You can attend without participating at first." },
];

function EventDetail() {
  const { id } = Route.useParams();
  const { action } = Route.useSearch();
  const router = useRouter();
  const nav = useNavigate();
  const event = events.find((e) => e.id === id);
  const { registrations, setRegistration } = useApp();
  const [confirm, setConfirm] = useState<{ title: string; sub: string } | null>(null);

  const reg = registrations.find((r) => r.eventId === event?.id);

  // Honour ?action=join when arriving from the map "Join" button.
  useEffect(() => {
    if (action === "join" && event && reg?.state !== "Join") {
      onPickMain("Join", "You’re in. Arrival help will appear before the event.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, event?.id]);

  if (!event) return null;
  const joined = reg?.state === "Join";
  const openSpots = event.maxCapacity - event.currentRegistration;
  const [lat, lng] = event.coords.split(",").map((s) => parseFloat(s.trim()));
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  function onPickMain(state: MainState, sub: string) {
    setRegistration(event!.id, state, { bringFriend: reg?.bringFriend ?? false });
    setConfirm({ title: state, sub });
  }

  function toggleBringFriend() {
    const next = !(reg?.bringFriend ?? false);
    // Preserve existing main state; default to Interested if none set yet.
    const main = (reg?.state && reg.state !== "Bring a friend"
      ? reg.state
      : "Interested") as MainState;
    setRegistration(event!.id, main, { bringFriend: next });
    setConfirm({
      title: next ? "Bring a friend" : "Friend removed",
      sub: next
        ? "You can show up together."
        : "Going solo again — that’s fine too.",
    });
  }

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      nav({ to: "/events" });
    }
  };

  return (
    <MobileShell>
      <div className="px-4 pt-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goBack} className="text-forest p-2 -ml-2" aria-label="Back to events">
            <ArrowLeft size={20} />
          </button>
          <span className="text-[11px] px-2.5 py-1 rounded-md bg-canvas font-semibold text-forest">{event.category}</span>
        </div>

        <div className="card-soft p-5">
          <div className="flex items-start gap-3">
            <div className="text-3xl w-14 h-14 rounded-2xl bg-canvas flex items-center justify-center">{event.icon}</div>
            <div className="flex-1">
              <h1 className="text-[22px] font-bold leading-tight">{event.title}</h1>
              <p className="text-[13px] text-[#374151] mt-1">{event.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <Info icon={<Clock size={14} />} label="When" value={event.startTime} />
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-canvas hover:bg-turquoise/10 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-forest/60 text-[10px] uppercase tracking-wider font-semibold">
                <MapPin size={14} />Where
                <ExternalLink size={11} className="ml-auto text-turquoise" />
              </div>
              <p className="text-[14px] font-semibold text-forest mt-1 leading-tight">{event.locationName}</p>
            </a>
            <Info icon={<Users size={14} />} label="Open spots" value={`${openSpots} of ${event.maxCapacity}`} />
            <Info icon={<ShieldCheck size={14} />} label="Organiser" value={event.organiser} verified={event.organiserVerified} />
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {event.beginnerFriendly && <Tag>Beginner-friendly</Tag>}
            <Tag>{event.skillLevel}</Tag>
            <Tag>Age {event.ageRangeMin}+</Tag>
            {event.peopleComeAlone && <Tag>People often come alone</Tag>}
            {event.welcomeHost && <Tag>Welcome host present</Tag>}
            {event.teamBased && <Tag>Teams of {event.teamSize}</Tag>}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-success/5 flex items-start gap-2">
            <Accessibility size={14} className="text-forest mt-0.5" />
            <p className="text-[12px] text-forest leading-relaxed">{event.accessibility}</p>
          </div>

          <p className="micro-label mt-4 normal-case tracking-normal text-[12px] opacity-60">
            {event.recommendationReason}
          </p>
        </div>

        {/* Capacity bar */}
        <div className="mt-4 card-soft p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-forest">Capacity</p>
            <p className="text-[11px] text-forest/60">{event.currentRegistration}/{event.maxCapacity} registered · min {event.minCapacity}</p>
          </div>
          <div className="h-2 bg-canvas rounded-full overflow-hidden">
            <div
              className="h-full bg-turquoise transition-all"
              style={{ width: `${Math.min(100, (event.currentRegistration / event.maxCapacity) * 100)}%` }}
            />
          </div>
        </div>

        {/* Main status — single select */}
        <h2 className="text-[17px] font-bold mt-6 mb-3">How do you want to join?</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {MAIN.map(({ state, icon: Icon, sub }) => {
            const active = reg?.state === state;
            const primary = state === "Join";
            return (
              <button
                key={state}
                onClick={() => onPickMain(state, sub)}
                className={`p-3 rounded-xl text-left transition-all border-2 ${
                  active
                    ? primary
                      ? "border-turquoise bg-turquoise text-white"
                      : "border-turquoise bg-turquoise/10"
                    : primary
                    ? "border-turquoise bg-turquoise/5"
                    : "border-border bg-white"
                }`}
              >
                <Icon size={16} className={active && primary ? "text-white" : "text-forest"} />
                <p className={`text-[13px] font-semibold mt-1 ${active && primary ? "text-white" : "text-forest"}`}>{state}</p>
              </button>
            );
          })}
        </div>

        {/* Bring a friend — independent toggle */}
        {event.bringFriendAllowed && (
          <button
            onClick={toggleBringFriend}
            className={`mt-3 w-full p-3.5 rounded-xl border-2 inline-flex items-center justify-between transition-all ${
              reg?.bringFriend
                ? "border-turquoise bg-turquoise/10"
                : "border-dashed border-forest/20 bg-white"
            }`}
          >
            <span className="inline-flex items-center gap-2 text-forest font-semibold text-[14px]">
              <UserPlus size={16} className="text-turquoise" /> Bring a friend
            </span>
            <span className={`text-[12px] font-semibold ${reg?.bringFriend ? "text-turquoise" : "text-forest/40"}`}>
              {reg?.bringFriend ? "On" : "Off"}
            </span>
          </button>
        )}

        {/* Arrival companion (visible after join) */}
        {joined && <ArrivalCompanion eventId={event.id} />}

        {event.teamBased && joined && <TeamPlacement />}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 bg-forest/40 flex items-end sm:items-center justify-center" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-[440px] p-6 m-0 sm:m-4 animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-forest/15 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center mb-3">
              <Check size={22} className="text-success" />
            </div>
            <h3 className="text-[18px] font-bold">{confirm.title}</h3>
            <p className="text-[14px] text-[#374151] mt-1">{confirm.sub}</p>
            <button onClick={() => setConfirm(null)} className="mt-5 w-full bg-turquoise text-white font-semibold py-3.5 rounded-xl">
              Got it
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function Info({ icon, label, value, verified }: { icon: React.ReactNode; label: string; value: string; verified?: boolean }) {
  return (
    <div className="p-3 rounded-xl bg-canvas">
      <div className="flex items-center gap-1.5 text-forest/60 text-[10px] uppercase tracking-wider font-semibold">
        {icon}{label}
      </div>
      <p className="text-[14px] font-semibold text-forest mt-1 leading-tight flex items-center gap-1">
        {value}{verified && <ShieldCheck size={13} className="text-turquoise" />}
      </p>
    </div>
  );
}
function Tag({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] px-2 py-1 rounded-md bg-canvas text-forest font-medium">{children}</span>;
}

function ArrivalCompanion({ eventId }: { eventId: string }) {
  const event = events.find((e) => e.id === eventId)!;
  const { checkIn, registrations } = useApp();
  const reg = registrations.find((r) => r.eventId === eventId);
  return (
    <div className="card-soft mt-6 p-5 border-2 border-turquoise/30">
      <div className="flex items-center gap-2 mb-1">
        <Flag size={16} className="text-turquoise" />
        <p className="micro-label">Arrival Companion</p>
      </div>
      <h3 className="text-[18px] font-bold">First 10 minutes, made easy</h3>

      <div className="mt-4 space-y-3">
        <Row label="Exact location" value={event.locationName} />
        <Row label="Coordinates" value={event.coords} />
        <Row label="Bring" value={event.whatToBring.join(", ")} />
        <Row label="Host" value="Look for Sam with a green Haven badge" />
      </div>

      <p className="micro-label mt-5 mb-2">First 10 minutes</p>
      <ol className="space-y-2">
        {[
          "Find the turquoise welcome flag",
          "Meet the host — no introductions needed",
          "Warm-up starts casually",
          "Teams are assigned automatically",
        ].map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#374151]">
            <span className="w-5 h-5 rounded-full bg-turquoise/15 text-turquoise text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-2 gap-2 mt-5">
        <button
          onClick={() => checkIn(eventId)}
          disabled={reg?.checkedIn}
          className="py-3.5 rounded-xl bg-turquoise text-white font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          {reg?.checkedIn ? <><Check size={16} /> Checked in</> : <><Flag size={16} /> I'm here</>}
        </button>
        <button className="py-3.5 rounded-xl bg-white border-2 border-turquoise/30 text-forest font-semibold inline-flex items-center justify-center gap-2">
          <QrCode size={16} /> Scan QR
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[12px] text-forest/60 uppercase tracking-wider font-semibold">{label}</span>
      <span className="text-[13px] text-forest font-medium text-right">{value}</span>
    </div>
  );
}

function TeamPlacement() {
  return (
    <div className="card-soft mt-4 p-5">
      <p className="micro-label">Team Placement Preview</p>
      <h3 className="text-[17px] font-bold mt-1">Anonymized teams</h3>
      <p className="text-[12px] text-forest/60 mt-1">Lightly balanced by skill. First-timers spread across teams.</p>
      <div className="mt-4 space-y-2">
        {[
          { label: "Team A", you: true, others: 2 },
          { label: "Team B", you: false, others: 3 },
          { label: "Team C", you: false, others: 3 },
        ].map((t) => (
          <div key={t.label} className="flex items-center justify-between px-4 py-3 rounded-xl bg-canvas">
            <span className="font-semibold text-forest">{t.label}</span>
            <span className="text-[13px] text-forest/70">{t.you ? "You + 2 others" : `${t.others} participants`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

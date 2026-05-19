import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/app-store";
import { eventService } from "@/services/eventService";
import { aiProposalService } from "@/services/aiProposalService";
import { read, subscribe } from "@/services/db";
import { TABLES, type CivicEvent, type AiProposal } from "@/services/types";
import { zones } from "@/lib/mock-data";
import { useSyncExternalStore } from "react";
import { ArrowLeft, Sparkles, ShieldCheck, Check, X, Plus } from "lucide-react";

export const Route = createFileRoute("/organiser")({
  head: () => ({
    meta: [
      { title: "Organiser — Haven" },
      { name: "description", content: "Create events and review AI proposals." },
    ],
  }),
  component: Organiser,
});

function useTable<T>(table: string): T[] {
  return useSyncExternalStore(
    (cb) => subscribe(table, cb) ?? (() => {}),
    () => read<T>(table),
    () => read<T>(table),
  );
}

function Organiser() {
  const nav = useNavigate();
  const { session, organiser, prefs, setPrefs } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const allEvents = useTable<CivicEvent>(TABLES.events);
  const proposals = useTable<AiProposal>(TABLES.aiProposals);

  if (!session) {
    return (
      <MobileShell showNav={false}>
        <div className="px-6 pt-16">
          <p className="text-[14px] text-[#374151]">Please sign in as an organiser to continue.</p>
          <button onClick={() => nav({ to: "/login" })} className="mt-4 bg-turquoise text-white px-5 py-3 rounded-xl font-semibold">
            Sign in
          </button>
        </div>
      </MobileShell>
    );
  }
  if (session.role !== "organiser" || !organiser) {
    return (
      <MobileShell>
        <div className="px-6 pt-12">
          <h1 className="text-[20px] font-bold">Organiser hub</h1>
          <p className="text-[13px] text-[#374151] mt-2">This area is for verified organisers.</p>
        </div>
      </MobileShell>
    );
  }

  if (!prefs.organiserVerified) {
    return (
      <MobileShell>
        <div className="px-4 pt-5 pb-6">
          <div className="flex items-center gap-3 mb-5">
            <Link to="/settings" className="text-forest p-2 -ml-2"><ArrowLeft size={20} /></Link>
            <h1 className="text-[22px] font-bold leading-tight">Organiser</h1>
          </div>
          <div className="card-soft p-6 text-center">
            <ShieldCheck size={32} className="text-turquoise mx-auto" />
            <h2 className="text-[17px] font-bold mt-2">Verification required</h2>
            <p className="text-[13px] text-[#374151] mt-2">Only verified organisers can create public events.</p>
            <Link to="/verify" className="mt-4 inline-block bg-turquoise text-white px-5 py-3 rounded-xl font-semibold">Get verified</Link>
            <button
              onClick={() => setPrefs({ organiserVerified: true })}
              className="mt-3 block mx-auto text-[12px] text-forest/50 underline"
            >
              Simulate verified state (demo)
            </button>
          </div>
        </div>
      </MobileShell>
    );
  }

  const myEvents = allEvents.filter((e) => e.organiser_id === organiser.id);

  const onApprove = async (p: AiProposal) => {
    if (!organiser) return;
    setBusy(p.id);
    try {
      await aiProposalService.approve(p.id, organiser.id);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  const onReject = async (p: AiProposal) => {
    setBusy(p.id);
    try {
      await aiProposalService.reject(p.id);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <MobileShell>
      <div className="px-4 pt-5 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Link to="/settings" className="text-forest p-2 -ml-2"><ArrowLeft size={20} /></Link>
            <div>
              <p className="micro-label">Verified organiser</p>
              <h1 className="text-[22px] font-bold leading-tight">{organiser.name}</h1>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1.5 rounded-md bg-turquoise/15 text-forest font-semibold inline-flex items-center gap-1">
            <ShieldCheck size={12} /> Verified
          </span>
        </div>

        <p className="micro-label mb-2">AI Event Proposals</p>
        <div className="space-y-3">
          {proposals.length === 0 && (
            <div className="card-soft p-4 text-[13px] text-forest/60">No proposals right now.</div>
          )}
          {proposals.map((p) => (
            <div key={p.id} className="card-soft p-4 border-l-4 border-turquoise">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-turquoise" />
                <p className="micro-label">AI detected demand · {p.zone_id}</p>
              </div>
              <h3 className="text-[16px] font-bold leading-tight">{p.detected_theme}</h3>
              <p className="text-[13px] text-[#374151] mt-1.5 leading-relaxed">{p.proposal_reason}</p>
              <p className="text-[12px] text-forest font-semibold mt-2">
                Suggested: {p.suggested_location_name} · {p.suggested_start_time}
              </p>
              {p.status === "proposed" ? (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    disabled={busy === p.id}
                    onClick={() => onApprove(p)}
                    className="py-2.5 rounded-lg bg-turquoise text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1 disabled:opacity-60"
                  >
                    <Check size={14} /> {busy === p.id ? "Publishing…" : "Approve & publish"}
                  </button>
                  <button
                    disabled={busy === p.id}
                    onClick={() => onReject(p)}
                    className="py-2.5 rounded-lg bg-white border border-border text-forest text-[13px] font-semibold inline-flex items-center justify-center gap-1"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              ) : (
                <div className={`mt-3 text-[12px] font-semibold ${p.status === "rejected" ? "text-boundary" : "text-success"}`}>
                  {p.status === "rejected" ? "Rejected" : "Approved — event published"}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-7 mb-2">
          <p className="micro-label">My events ({myEvents.length})</p>
          <button onClick={() => setShowCreate(true)} className="text-[12px] text-turquoise font-semibold inline-flex items-center gap-1">
            <Plus size={12} /> New
          </button>
        </div>
        <div className="space-y-2">
          {myEvents.length === 0 && (
            <div className="card-soft p-4 text-[13px] text-forest/60">
              No events yet. Tap "New" to create one.
            </div>
          )}
          {myEvents.map((e) => (
            <Link key={e.id} to="/event/$id" params={{ id: e.id }} className="card-soft p-3 flex items-center gap-3">
              <div className="text-xl w-10 h-10 rounded-xl bg-canvas flex items-center justify-center">{e.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-forest leading-tight truncate">{e.title}</p>
                <p className="text-[11px] text-forest/60 mt-0.5">
                  {e.start_time} · {e.current_registration}/{e.max_capacity} · {e.status}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {showCreate && (
          <CreateEventSheet
            organiserId={organiser.id}
            organiserName={organiser.name}
            defaultZone={organiser.municipality_zone_id ?? "kralingen"}
            onClose={() => setShowCreate(false)}
          />
        )}
      </div>
    </MobileShell>
  );
}

function CreateEventSheet({
  organiserId,
  organiserName,
  defaultZone,
  onClose,
}: {
  organiserId: string;
  organiserName: string;
  defaultZone: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("Beginner 3v3 Street Run");
  const [category, setCategory] = useState("Sports");
  const [subcategory, setSubcategory] = useState("Basketball");
  const [zoneId, setZoneId] = useState(defaultZone);
  const [locationName, setLocationName] = useState("Kralingen Court");
  const [startTime, setStartTime] = useState("18:30");
  const [endTime, setEndTime] = useState("20:00");
  const [minCapacity, setMinCapacity] = useState(6);
  const [maxCapacity, setMaxCapacity] = useState(12);
  const [accessibility, setAccessibility] = useState("Wheelchair accessible");
  const [beginnerFriendly, setBeginnerFriendly] = useState(true);
  const [comeAlone, setComeAlone] = useState(true);
  const [welcomeHost, setWelcomeHost] = useState(true);
  const [teamBased, setTeamBased] = useState(false);
  const [spectators, setSpectators] = useState(true);
  const [bringFriend, setBringFriend] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      const z = zones.find((x) => x.id === zoneId) ?? zones[0];
      await eventService.create(organiserId, organiserName, {
        title,
        category,
        subcategory,
        zone_id: z.id,
        location_name: locationName,
        lat: z.center[0],
        lng: z.center[1],
        start_time: `Today ${startTime}`,
        end_time: endTime,
        min_capacity: Number(minCapacity),
        max_capacity: Number(maxCapacity),
        accessibility_info: accessibility,
        beginner_friendly: beginnerFriendly,
        people_usually_come_alone: comeAlone,
        welcome_host_present: welcomeHost,
        team_based: teamBased,
        spectators_allowed: spectators,
        bring_friend_allowed: bringFriend,
        icon: category === "Sports" ? "🏀" : category === "Cooking" ? "🍳" : category === "Board Games" ? "🎲" : "📚",
      });
      onClose();
    } catch (e: any) {
      setErr(e.message ?? "Failed to publish");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-forest/40 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full max-w-[440px] p-6 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 bg-forest/15 rounded-full mx-auto mb-4" />
        <h2 className="text-[20px] font-bold">Create event</h2>
        <p className="text-[12px] text-forest/60 mt-1">Only eligible residents will see your event.</p>

        <div className="space-y-3 mt-4">
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]">
                <option>Sports</option><option>Board Games</option><option>Cooking</option><option>Literature</option>
              </select>
            </Field>
            <Field label="Subcategory">
              <input value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" />
            </Field>
          </div>
          <Field label="Zone">
            <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]">
              {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
          </Field>
          <Field label="Location">
            <input value={locationName} onChange={(e) => setLocationName(e.target.value)} className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start"><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" /></Field>
            <Field label="End"><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min capacity"><input type="number" value={minCapacity} onChange={(e) => setMinCapacity(Number(e.target.value))} className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" /></Field>
            <Field label="Max capacity"><input type="number" value={maxCapacity} onChange={(e) => setMaxCapacity(Number(e.target.value))} className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" /></Field>
          </div>
          <Field label="Accessibility">
            <input value={accessibility} onChange={(e) => setAccessibility(e.target.value)} className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" />
          </Field>
          <div className="space-y-2 pt-1">
            <Toggle label="Beginner-friendly" v={beginnerFriendly} onChange={setBeginnerFriendly} />
            <Toggle label="People usually come alone" v={comeAlone} onChange={setComeAlone} />
            <Toggle label="Welcome host present" v={welcomeHost} onChange={setWelcomeHost} />
            <Toggle label="Team-based" v={teamBased} onChange={setTeamBased} />
            <Toggle label="Spectators allowed" v={spectators} onChange={setSpectators} />
            <Toggle label="Bring-a-friend allowed" v={bringFriend} onChange={setBringFriend} />
          </div>
        </div>

        {err && <p className="text-[13px] text-boundary mt-3">{err}</p>}

        <button
          disabled={busy}
          onClick={submit}
          className="mt-5 w-full bg-turquoise text-white font-semibold py-3.5 rounded-xl disabled:opacity-60"
        >
          {busy ? "Publishing…" : "Publish event"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="micro-label mb-1.5">{label}</p>
      {children}
    </div>
  );
}

function Toggle({ label, v, onChange }: { label: string; v: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between text-[13px] text-forest font-medium">
      <span>{label}</span>
      <input type="checkbox" checked={v} onChange={(e) => onChange(e.target.checked)} className="accent-[var(--turquoise)] w-5 h-5" />
    </label>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/app-store";
import { zones, ageRanges } from "@/lib/mock-data";
import { ShieldCheck, Bell, Accessibility, Lock, MapPin, Sparkles, ChevronRight, Building2, BadgeCheck, LogOut, Trash2 } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Haven" }, { name: "description", content: "Manage preferences, accessibility, privacy and verification." }] }),
  component: Settings,
});

function Settings() {
  const { prefs, setPrefs, resetAll, session, organiser, signOut, deleteMyData } = useApp();
  const nav = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);


  return (
    <MobileShell>
      <div className="px-4 pt-6 pb-6">
        <h1 className="text-[24px] font-bold">Settings</h1>
        <p className="text-[14px] text-[#374151] mt-1">Your preferences. Always editable.</p>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <LinkCard to="/interests" icon={<BadgeCheck size={18} />} title="My Interests" sub="Pick what you enjoy" />
          <LinkCard to="/suggested" icon={<BadgeCheck size={18} />} title="Suggested Events" sub="Small group meetups" />
          <LinkCard to="/verify" icon={<BadgeCheck size={18} />} title="Get Verified" sub="As an organiser" />
          <LinkCard to="/municipality" icon={<Building2 size={18} />} title="Municipality" sub="Dashboard preview" />
        </div>

        <Section icon={<MapPin size={16} />} title="Location & age">
          <Row label="Neighbourhood">
            <select
              value={prefs.zoneId}
              onChange={(e) => setPrefs({ zoneId: e.target.value })}
              className="bg-canvas rounded-lg px-3 py-2 text-[13px] font-semibold text-forest outline-none"
            >
              {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
          </Row>
          <Row label={`Radius: ${prefs.radiusKm}km`}>
            <input
              type="range" min={1} max={20} value={prefs.radiusKm}
              onChange={(e) => setPrefs({ radiusKm: Number(e.target.value) })}
              className="w-32 accent-[var(--turquoise)]"
            />
          </Row>
          <Row label="Age range">
            <select
              value={prefs.ageRange ?? ""}
              onChange={(e) => setPrefs({ ageRange: e.target.value as any })}
              className="bg-canvas rounded-lg px-3 py-2 text-[13px] font-semibold text-forest outline-none"
            >
              {ageRanges.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Row>
          <Row label="Gender (optional)">
            <select
              value={prefs.gender ?? "Prefer not to say"}
              onChange={(e) => setPrefs({ gender: e.target.value as any })}
              className="bg-canvas rounded-lg px-3 py-2 text-[13px] font-semibold text-forest outline-none"
            >
              {["Male","Female","Other","Prefer not to say"].map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Row>
        </Section>

        <Section icon={<Sparkles size={16} />} title="Interests">
          <Link
            to="/interests"
            className="flex items-center justify-between py-3.5 -mx-1 px-1 active:opacity-80"
          >
            <div>
              <p className="text-[14px] font-semibold text-forest">Change hobby preferences</p>
              <p className="text-[12px] text-forest/60 mt-0.5">
                Update the activities used for recommendations.
              </p>
            </div>
            <ChevronRight size={18} className="text-forest/40" />
          </Link>
        </Section>

        <Section icon={<Bell size={16} />} title="Notifications">
          {[
            ["nearby","Nearby events"],
            ["recommended","Recommended events"],
            ["startingSoon","Starting soon"],
            ["quiet","Quiet activities"],
            ["team","Team activities"],
            ["weekend","Weekend events"],
          ].map(([k,label]) => (
            <Row key={k} label={label}>
              <Toggle on={!!prefs.notifications[k]} onChange={(v) => setPrefs({ notifications: { ...prefs.notifications, [k]: v } })} />
            </Row>
          ))}
        </Section>

        <Section icon={<Accessibility size={16} />} title="Accessibility">
          <Row label="Reduce motion">
            <Toggle on={prefs.accessibility.reducedMotion} onChange={(v) => setPrefs({ accessibility: { ...prefs.accessibility, reducedMotion: v } })} />
          </Row>
          <Row label="High contrast">
            <Toggle on={prefs.accessibility.highContrast} onChange={(v) => setPrefs({ accessibility: { ...prefs.accessibility, highContrast: v } })} />
          </Row>
          <Row label="Colorblind theme">
            <Toggle on={prefs.accessibility.colorblind} onChange={(v) => setPrefs({ accessibility: { ...prefs.accessibility, colorblind: v } })} />
          </Row>
          <Row label={`Font size: ${Math.round(prefs.accessibility.fontScale * 100)}%`}>
            <input
              type="range" min={1.0} max={1.4} step={0.1} value={prefs.accessibility.fontScale}
              onChange={(e) => setPrefs({ accessibility: { ...prefs.accessibility, fontScale: Number(e.target.value) } })}
              className="w-32 accent-[var(--turquoise)]"
            />
          </Row>
        </Section>

        <Section icon={<Lock size={16} />} title="Privacy">
          <Row label="Pause recommendations">
            <Toggle on={prefs.privacy.pauseRecs} onChange={(v) => setPrefs({ privacy: { ...prefs.privacy, pauseRecs: v } })} />
          </Row>
          {prefs.privacy.pauseRecs && (
            <p className="text-[12px] text-forest/60 -mt-2 pb-3">
              Recommendations are paused. You can still search events manually.
            </p>
          )}
          <Row label="Hide me from matching">
            <Toggle on={prefs.privacy.hideFromMatching} onChange={(v) => setPrefs({ privacy: { ...prefs.privacy, hideFromMatching: v } })} />
          </Row>
          {prefs.privacy.hideFromMatching && (
            <p className="text-[12px] text-forest/60 -mt-2 pb-3">
              You can still join events manually, but your preferences will not be used for matching or demand detection.
            </p>
          )}
          <button onClick={() => setConfirmDelete(true)} className="w-full text-left px-1 py-3 text-[13px] text-boundary font-semibold inline-flex items-center gap-2">
            <Trash2 size={14} /> Delete my data
          </button>
        </Section>

        {session && (
          <Section icon={<LogOut size={16} />} title="Account">
            <Row label={session.role === "resident" ? "Resident" : session.role === "organiser" ? `Organiser · ${organiser?.name ?? ""}` : "Municipality admin"}>
              <span className="text-[11px] text-forest/60">{session.profile_id.slice(0, 12)}…</span>
            </Row>
            <button
              onClick={() => { signOut(); nav({ to: "/login" }); }}
              className="w-full text-left px-1 py-3 text-[13px] text-forest font-semibold inline-flex items-center gap-2"
            >
              <LogOut size={14} /> Sign out
            </button>
          </Section>
        )}

        <div className="card-soft mt-5 p-4 bg-success/5">
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="text-success mt-0.5" />
            <p className="text-[12px] text-forest leading-relaxed">
              You control what the app uses. Municipality dashboards only receive anonymous aggregate counts.
            </p>
          </div>
        </div>

        <button onClick={resetAll} className="mt-5 text-[12px] text-forest/40 underline">Reset prototype data</button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-forest/40 flex items-end sm:items-center justify-center" onClick={() => setConfirmDelete(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-[440px] p-6 m-0 sm:m-4 animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-forest/15 rounded-full mx-auto mb-4 sm:hidden" />
            <h3 className="text-[18px] font-bold">Delete your data?</h3>
            <p className="text-[14px] text-[#374151] mt-2 leading-relaxed">
              This will remove your profile, preferences, saved events, joins, and recommendation history from this prototype. Municipality dashboards only keep anonymous aggregate counts.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button onClick={() => setConfirmDelete(false)} className="py-3.5 rounded-xl bg-canvas text-forest font-semibold">
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMyData();
                  setConfirmDelete(false);
                  setDeleted(true);
                  setTimeout(() => nav({ to: "/login" }), 800);
                }}
                className="py-3.5 rounded-xl bg-boundary text-white font-semibold"
              >
                Delete my data
              </button>
            </div>
          </div>
        </div>
      )}

      {deleted && (
        <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-forest text-white text-[13px] font-semibold shadow-soft">
            Your data has been deleted.
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-2.5 px-1">
        <span className="text-turquoise">{icon}</span>
        <p className="micro-label">{title}</p>
      </div>
      <div className="card-soft px-4 divide-y divide-border">{children}</div>
    </section>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-[14px] text-forest font-medium">{label}</span>
      {children}
    </div>
  );
}
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`w-11 h-6 rounded-full relative transition-colors ${on ? "bg-turquoise" : "bg-forest/15"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}
function LinkCard({ to, icon, title, sub }: { to: any; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Link to={to} className="card-soft p-4 flex items-center gap-3 active:scale-[0.99] transition-transform">
      <div className="w-10 h-10 rounded-xl bg-turquoise/15 text-turquoise flex items-center justify-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-forest leading-tight">{title}</p>
        <p className="text-[11px] text-forest/60">{sub}</p>
      </div>
      <ChevronRight size={16} className="text-forest/30" />
    </Link>
  );
}

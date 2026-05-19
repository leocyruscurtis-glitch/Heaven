import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/app-store";
import { interests as ALL_INTERESTS, ageRanges, zones, type AgeRange } from "@/lib/mock-data";
import { ChevronRight, ArrowLeft, Check } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — Haven" }, { name: "description", content: "Lightweight onboarding for nearby civic activities." }] }),
  component: Onboarding,
});

type Step = 0 | 1 | 2 | 3 | 4 | 5;

function Onboarding() {
  const { prefs, setPrefs, session } = useApp();
  const nav = useNavigate();
  useEffect(() => { if (!session) nav({ to: "/login" }); }, [session, nav]);
  const [step, setStep] = useState<Step>(0);
  const [ageRange, setAgeRange] = useState<AgeRange | null>(prefs.ageRange);
  const [gender, setGender] = useState(prefs.gender);
  const [zoneId, setZoneId] = useState(prefs.zoneId);
  const [picked, setPicked] = useState<string[]>(prefs.interests);
  const [notif, setNotif] = useState(prefs.notifications);

  const toggleInterest = (id: string) =>
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const next = () => setStep((s) => (Math.min(5, s + 1) as Step));
  const back = () => setStep((s) => (Math.max(0, s - 1) as Step));

  const finish = () => {
    setPrefs({ onboarded: true, ageRange, gender, zoneId, interests: picked, notifications: notif });
    nav({ to: "/" });
  };

  return (
    <MobileShell showNav={false}>
      <div className="px-6 pt-12 pb-8 min-h-screen flex flex-col">
        <div className="flex items-center justify-between mb-6">
          {step > 0 ? (
            <button onClick={back} className="text-forest p-2 -ml-2"><ArrowLeft size={20} /></button>
          ) : <div className="w-6" />}
          <div className="flex gap-1.5">
            {[0,1,2,3,4,5].map((i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i <= step ? "w-6 bg-turquoise" : "w-3 bg-forest/15"}`} />
            ))}
          </div>
          <button onClick={finish} className="text-[12px] text-forest/50">Skip</button>
        </div>

        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-[28px] font-bold leading-tight">Welcome to Haven</h1>
            <p className="text-[15px] text-[#374151] mt-3 leading-relaxed">
              Find nearby activities and join small groups without the awkward first step. Backed by your municipality.
            </p>
            <div className="card-soft p-4 mt-6 bg-success/5">
              <p className="text-[13px] text-forest leading-relaxed">
                We only use the preferences you choose. No public profiles, no ratings, no open chats, and no loneliness scores.
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex-1">
            <h1 className="text-[24px] font-bold">Your age range</h1>
            <p className="text-[14px] text-[#374151] mt-2">Helps us only show events you're eligible for. Adults only (18+).</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {ageRanges.map((a) => (
                <button
                  key={a}
                  onClick={() => setAgeRange(a)}
                  className={`py-4 rounded-xl border-2 font-semibold transition-all ${
                    ageRange === a ? "border-turquoise bg-turquoise text-white" : "border-border bg-white text-forest"
                  }`}
                >{a}</button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1">
            <h1 className="text-[24px] font-bold">Gender</h1>
            <p className="text-[14px] text-[#374151] mt-2">Optional, only used when relevant for comfort or safety preferences.</p>
            <div className="flex flex-col gap-2 mt-6">
              {(["Male","Female","Other","Prefer not to say"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl border-2 text-left transition-all ${
                    gender === g ? "border-turquoise bg-turquoise/10" : "border-border bg-white"
                  }`}
                >
                  <span className="font-medium text-forest">{g}</span>
                  {gender === g && <Check size={18} className="text-turquoise" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1">
            <h1 className="text-[24px] font-bold">Your neighbourhood</h1>
            <p className="text-[14px] text-[#374151] mt-2">Pick a zone. You can change this anytime.</p>
            <div className="flex flex-col gap-2 mt-6 max-h-[60vh] overflow-auto">
              {zones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setZoneId(z.id)}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl border-2 text-left transition-all ${
                    zoneId === z.id ? "border-turquoise bg-turquoise/10" : "border-border bg-white"
                  }`}
                >
                  <span className="font-medium text-forest">{z.name}</span>
                  {zoneId === z.id && <Check size={18} className="text-turquoise" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1">
            <h1 className="text-[24px] font-bold">What are you into?</h1>
            <p className="text-[14px] text-[#374151] mt-2">Tap a bubble. Tap again to expand into specifics.</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {ALL_INTERESTS.map((i) => {
                const on = picked.includes(i.id);
                return (
                  <button
                    key={i.id}
                    onClick={() => toggleInterest(i.id)}
                    className={`px-4 py-2.5 rounded-xl border font-medium text-[14px] transition-all ${
                      on ? "bg-turquoise text-white border-turquoise" : "bg-canvas text-forest border-forest/15"
                    }`}
                  >
                    <span className="mr-1.5">{i.icon}</span>{i.name}
                  </button>
                );
              })}
            </div>
            {picked.length > 0 && (
              <div className="mt-6 space-y-4">
                {ALL_INTERESTS.filter((i) => picked.includes(i.id)).map((i) => (
                  <div key={i.id}>
                    <p className="micro-label mb-2">{i.name} — specifics (optional)</p>
                    <div className="flex flex-wrap gap-2">
                      {i.subs.map((s) => {
                        const on = picked.includes(s);
                        return (
                          <button
                            key={s}
                            onClick={() => toggleInterest(s)}
                            className={`px-3 py-1.5 rounded-xl border text-[13px] transition-all ${
                              on ? "bg-turquoise text-white border-turquoise" : "bg-white text-forest border-forest/15"
                            }`}
                          >{s}</button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="flex-1">
            <h1 className="text-[24px] font-bold">Notifications</h1>
            <p className="text-[14px] text-[#374151] mt-2">Bright and low-pressure. Change anytime.</p>
            <div className="flex flex-col gap-2 mt-6">
              {[
                ["nearby","Nearby events"],
                ["recommended","Recommended events"],
                ["startingSoon","Events starting soon"],
                ["quiet","Quiet activities"],
                ["team","Team activities"],
                ["weekend","Weekend events"],
              ].map(([k,label]) => (
                <label key={k} className="flex items-center justify-between px-4 py-4 rounded-xl bg-white border border-border">
                  <span className="font-medium text-forest">{label}</span>
                  <Toggle on={!!notif[k]} onChange={(v) => setNotif({ ...notif, [k]: v })} />
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6">
          {step < 5 ? (
            <button
              onClick={next}
              disabled={step === 1 && !ageRange}
              className="w-full bg-turquoise text-white font-semibold py-4 rounded-xl shadow-soft inline-flex items-center justify-center gap-2 disabled:opacity-40"
            >
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={finish}
              className="w-full bg-turquoise text-white font-semibold py-4 rounded-xl shadow-soft"
            >Continue to Map</button>
          )}
        </div>
      </div>
    </MobileShell>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-11 h-6 rounded-full transition-colors relative ${on ? "bg-turquoise" : "bg-forest/15"}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

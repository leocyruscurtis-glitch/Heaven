import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/app-store";
import { ArrowLeft, Check, ShieldCheck, ChevronRight, Mail, Phone, IdCard, FileCheck2, Landmark, Building2, Banknote, FileText } from "lucide-react";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Get Verified — Haven" }, { name: "description", content: "Organiser verification flow." }] }),
  component: Verify,
});

type Step = { id: string; title: string; sub: string; icon: any; tier: 1 | 2 | 3 | 4 };

const STEPS: Step[] = [
  { id: "email", title: "Email", sub: "Magic link or OTP", icon: Mail, tier: 1 },
  { id: "phone", title: "NL phone", sub: "SMS OTP", icon: Phone, tier: 1 },
  { id: "id", title: "ID verification", sub: "Passport, ID card or Residence Permit", icon: IdCard, tier: 1 },
  { id: "vog", title: "VOG", sub: "Verklaring Omtrent het Gedrag (Justis)", icon: FileCheck2, tier: 2 },
  { id: "kvk", title: "KvK extract", sub: "Recent (< 3 months)", icon: Building2, tier: 3 },
  { id: "ubo", title: "UBO declaration", sub: "NGOs, foundations, companies", icon: FileText, tier: 3 },
  { id: "muni", title: "Municipality token", sub: "Gemeente validation code", icon: Landmark, tier: 3 },
  { id: "iban", title: "NL IBAN", sub: "€0.01 iDEAL simulation", icon: Banknote, tier: 4 },
  { id: "btw", title: "BTW-id", sub: "Where applicable", icon: FileText, tier: 4 },
];

function Verify() {
  const { prefs, setPrefs } = useApp();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const completed = STEPS.filter((s) => done[s.id]).length;
  const allDone = completed === STEPS.length;

  return (
    <MobileShell>
      <div className="px-4 pt-5 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <Link to="/settings" className="text-forest p-2 -ml-2"><ArrowLeft size={20} /></Link>
          <div>
            <p className="micro-label">Organiser portal</p>
            <h1 className="text-[22px] font-bold leading-tight">Get Verified</h1>
          </div>
        </div>

        <div className="card-soft p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-forest">Verification status</p>
              <p className="text-[12px] text-forest/60 mt-1">
                {prefs.organiserVerified
                  ? "Verified organiser"
                  : allDone
                    ? "Awaiting municipality review"
                    : completed > 0 ? "In progress" : "Not started"}
              </p>
            </div>
            {prefs.organiserVerified ? (
              <span className="text-[11px] px-2.5 py-1.5 rounded-md bg-turquoise/15 text-forest font-semibold inline-flex items-center gap-1">
                <ShieldCheck size={12} /> Verified
              </span>
            ) : (
              <span className="text-[11px] px-2.5 py-1.5 rounded-md bg-canvas text-forest font-semibold">
                {completed}/{STEPS.length}
              </span>
            )}
          </div>
          <div className="h-2 bg-canvas rounded-full overflow-hidden mt-3">
            <div className="h-full bg-turquoise transition-all" style={{ width: `${(completed / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {[1,2,3,4].map((tier) => (
          <section className="mt-6" key={tier}>
            <p className="micro-label mb-2">Tier {tier} — {["", "Identity", "Background", "Organisation", "Financial"][tier]}</p>
            <div className="card-soft divide-y divide-border">
              {STEPS.filter((s) => s.tier === tier).map((s) => {
                const Icon = s.icon;
                const isDone = !!done[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => setDone({ ...done, [s.id]: !isDone })}
                    className="w-full flex items-center gap-3 p-4 text-left active:bg-canvas"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDone ? "bg-success/15 text-success" : "bg-canvas text-forest/60"}`}>
                      {isDone ? <Check size={18} /> : <Icon size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-forest leading-tight">{s.title}</p>
                      <p className="text-[12px] text-forest/60 mt-0.5">{s.sub}</p>
                    </div>
                    <ChevronRight size={16} className="text-forest/30" />
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <div className="card-soft mt-6 p-4 bg-success/5">
          <p className="text-[12px] text-forest leading-relaxed">
            Real KYC, VOG, iDIN, KvK, IBAN, iDEAL and BTW checks are simulated in this prototype. They represent future backend integrations.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            disabled={!allDone || prefs.organiserVerified}
            onClick={() => setPrefs({ organiserVerified: true })}
            className="py-3.5 rounded-xl bg-turquoise text-white font-semibold disabled:opacity-40"
          >
            Submit for review
          </button>
          <Link
            to="/organiser"
            className="py-3.5 rounded-xl bg-white border-2 border-turquoise/30 text-forest font-semibold text-center"
          >
            Go to organiser
          </Link>
        </div>

        {!prefs.organiserVerified && (
          <button
            onClick={() => setPrefs({ organiserVerified: true })}
            className="mt-3 w-full text-[12px] text-forest/50 underline"
          >Skip — simulate verified state (demo)</button>
        )}
      </div>
    </MobileShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { municipalityMetrics } from "@/lib/mock-data";
import { ArrowLeft, Building2, ShieldCheck, TrendingUp, Users, Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/municipality")({
  head: () => ({ meta: [{ title: "Municipality Dashboard — Haven" }, { name: "description", content: "Aggregated, anonymous civic activity metrics." }] }),
  component: Municipality,
});

function Municipality() {
  const m = municipalityMetrics;
  return (
    <MobileShell>
      <div className="px-4 pt-5 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <Link to="/settings" className="text-forest p-2 -ml-2"><ArrowLeft size={20} /></Link>
          <div>
            <p className="micro-label">Gemeente Rotterdam</p>
            <h1 className="text-[22px] font-bold leading-tight">Civic dashboard</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={<Calendar size={14} />} label="Events this month" value={m.eventsThisMonth} />
          <Stat icon={<Users size={14} />} label="Total attendances" value={m.totalAttendances} />
          <Stat icon={<TrendingUp size={14} />} label="First-time participants" value={`${m.firstTimePercent}%`} />
          <Stat icon={<Building2 size={14} />} label="Individual profiles accessible" value={m.individualProfilesAccessible} highlight />
        </div>

        <section className="mt-6">
          <p className="micro-label mb-2">Hobby demand</p>
          <div className="card-soft divide-y divide-border">
            {m.hobbyTrends.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-[14px] font-semibold text-forest leading-tight">{t.label}</p>
                  <p className="text-[11px] text-forest/60">{t.zone}</p>
                </div>
                <span className="text-[12px] font-semibold text-success">{t.delta}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <p className="micro-label mb-2">Geographic activity heatmap</p>
          <div className="card-soft p-4">
            <div className="space-y-2.5">
              {m.heatmap.map((h) => (
                <div key={h.zone}>
                  <div className="flex items-center justify-between text-[12px] text-forest mb-1">
                    <span className="font-medium inline-flex items-center gap-1"><MapPin size={11} /> {h.zone}</span>
                    <span className="text-forest/50">{Math.round(h.intensity * 100)}%</span>
                  </div>
                  <div className="h-2.5 bg-canvas rounded-full overflow-hidden">
                    <div className="h-full bg-turquoise" style={{ width: `${h.intensity * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="card-soft mt-6 p-4 bg-success/5">
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="text-success mt-0.5" />
            <p className="text-[12px] text-forest leading-relaxed">
              Municipality sees aggregated counts only. No single-user tracking, no loneliness scores, no individual profiles.
            </p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

function Stat({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`card-soft p-4 ${highlight ? "bg-success/5" : ""}`}>
      <div className="flex items-center gap-1.5 text-forest/60">
        <span className="text-turquoise">{icon}</span>
        <p className="text-[10px] uppercase tracking-wider font-semibold">{label}</p>
      </div>
      <p className="text-[26px] font-bold text-forest mt-1.5 leading-none">{value}</p>
    </div>
  );
}

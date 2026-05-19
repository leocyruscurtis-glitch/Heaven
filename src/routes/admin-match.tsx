import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/app-store";
import { supabase } from "@/integrations/supabase/client";
import { runMatching } from "@/lib/matching.functions";
import { ArrowLeft, Sparkles, Play } from "lucide-react";

export const Route = createFileRoute("/admin-match")({
  head: () => ({ meta: [{ title: "Admin · Matching — Haven" }] }),
  component: AdminMatch,
});

function AdminMatch() {
  const nav = useNavigate();
  const { session } = useApp();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!session) nav({ to: "/login" });
    else if (session.role !== "municipality_admin") nav({ to: "/" });
  }, [session, nav]);

  const run = async () => {
    setBusy(true);
    setErr(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Not signed in.");
      const res = await runMatching({ data: { accessToken: token } });
      setResult(res);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!session || session.role !== "municipality_admin") {
    return <MobileShell showNav={false}><div className="px-6 pt-16 text-[14px]">Admins only.</div></MobileShell>;
  }

  return (
    <MobileShell>
      <div className="px-4 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/municipality" className="text-forest p-2 -ml-2"><ArrowLeft size={20} /></Link>
          <div>
            <p className="micro-label">Admin · Testing</p>
            <h1 className="text-[22px] font-bold leading-tight">Run matching</h1>
          </div>
        </div>
        <p className="text-[13px] text-[#374151] mb-4">
          Groups users by same city + shared strong interest (≥4) into small suggested events. AI writes the copy only.
        </p>

        <button
          onClick={run}
          disabled={busy}
          className="w-full bg-turquoise text-white font-semibold py-3.5 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Play size={16} /> {busy ? "Running…" : "Run matching now"}
        </button>

        {err && <p className="text-[13px] text-boundary mt-3">{err}</p>}

        {result && (
          <div className="mt-5 space-y-3">
            <div className="card-soft p-3 text-[12px] text-forest/70">
              Scanned {result.totalGroups} (city × interest) groups · AI {result.aiConfigured ? "configured" : "fallback"}
            </div>

            <p className="micro-label">Created ({result.created.length})</p>
            {result.created.length === 0 && (
              <div className="card-soft p-3 text-[13px] text-forest/60">No new suggestions.</div>
            )}
            {result.created.map((c: any) => (
              <div key={c.event_id} className="card-soft p-3 border-l-4 border-turquoise">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={12} className="text-turquoise" />
                  <p className="micro-label">{c.city} · {c.shared_interest} · {c.group_size} users</p>
                </div>
                <p className="text-[14px] font-semibold">{c.title}</p>
                <p className="text-[11px] text-forest/50 mt-1">Status: {c.status}</p>
                <p className="text-[11px] text-forest/50 mt-1 break-all">
                  Participant IDs: {c.participant_ids.map((id: string) => id.slice(0, 8)).join(", ")}
                </p>
              </div>
            ))}

            {result.skipped.length > 0 && (
              <>
                <p className="micro-label mt-3">Skipped ({result.skipped.length})</p>
                {result.skipped.map((s: any, idx: number) => (
                  <div key={idx} className="card-soft p-2 text-[12px] text-forest/60">
                    {s.city} · {s.shared_interest} — {s.reason} (size {s.size})
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </MobileShell>
  );
}

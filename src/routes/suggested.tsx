import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/app-store";
import { listMySuggestions, respondToInvitation } from "@/services/matchingClient";
import { ArrowLeft, Check, X, Sparkles, MapPin, Users, Calendar } from "lucide-react";

type Item = Awaited<ReturnType<typeof listMySuggestions>>[number];

export const Route = createFileRoute("/suggested")({
  head: () => ({
    meta: [
      { title: "Suggested events — Haven" },
      { name: "description", content: "Meet people through things you already enjoy." },
    ],
  }),
  component: Suggested,
});

function Suggested() {
  const nav = useNavigate();
  const { session } = useApp();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = () =>
    listMySuggestions()
      .then(setItems)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    if (!session) {
      nav({ to: "/login" });
      return;
    }
    load();
  }, [session, nav]);

  const respond = async (item: Item, status: "accepted" | "declined") => {
    if (!item.my_participant_id) return;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, my_status: status } : i)));
    try {
      await respondToInvitation(item.my_participant_id, status);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <MobileShell>
      <div className="px-4 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="text-forest p-2 -ml-2"><ArrowLeft size={20} /></Link>
          <div>
            <p className="micro-label">For you</p>
            <h1 className="text-[22px] font-bold leading-tight">Suggested events</h1>
          </div>
        </div>
        <p className="text-[13px] text-[#374151] mb-4">
          Meet people through things you already enjoy. No pressure — accept or decline.
        </p>

        {err && <p className="text-[13px] text-boundary mb-2">{err}</p>}
        {loading && <p className="text-[13px] text-forest/60">Loading…</p>}

        {!loading && items.length === 0 && (
          <div className="card-soft p-6 text-center">
            <Sparkles size={24} className="text-turquoise mx-auto" />
            <p className="text-[14px] font-semibold mt-2">Nothing suggested yet</p>
            <p className="text-[12px] text-forest/60 mt-1">
              Add a few interests and a city in <Link to="/interests" className="text-turquoise font-semibold">My Interests</Link>. Suggestions appear when a few people nearby share a strong interest with you.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="card-soft p-4 border-l-4 border-turquoise">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-turquoise" />
                <p className="micro-label">Small group suggestion</p>
              </div>
              <h3 className="text-[17px] font-bold leading-tight">{i.title}</h3>
              {i.description && (
                <p className="text-[13px] text-[#374151] mt-1.5 leading-relaxed">{i.description}</p>
              )}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-forest/70">
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> {i.city}</span>
                <span className="inline-flex items-center gap-1"><Users size={12} /> Up to {i.max_participants}</span>
                {i.suggested_date && (
                  <span className="col-span-2 inline-flex items-center gap-1">
                    <Calendar size={12} /> {new Date(i.suggested_date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
              {i.match_reason && (
                <p className="mt-3 text-[12px] text-forest/80 italic">"{i.match_reason}"</p>
              )}
              {i.invitation_text && (
                <p className="mt-2 text-[13px] text-forest font-medium">{i.invitation_text}</p>
              )}

              {i.my_status === "invited" ? (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => respond(i, "accepted")}
                    className="py-2.5 rounded-lg bg-turquoise text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1"
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    onClick={() => respond(i, "declined")}
                    className="py-2.5 rounded-lg bg-white border border-border text-forest text-[13px] font-semibold inline-flex items-center justify-center gap-1"
                  >
                    <X size={14} /> Decline
                  </button>
                </div>
              ) : (
                <div className={`mt-4 text-[13px] font-semibold ${i.my_status === "accepted" ? "text-success" : "text-forest/50"}`}>
                  {i.my_status === "accepted" ? "✓ You're in — see you there." : "Declined. No worries."}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}

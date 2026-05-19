import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/app-store";
import {
  INTEREST_CATEGORIES,
  addInterest,
  listMyInterests,
  removeInterest,
  updateInterest,
  updateProfile,
  type UserInterestRow,
} from "@/services/matchingClient";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/interests")({
  head: () => ({
    meta: [
      { title: "My Interests — Haven" },
      { name: "description", content: "Pick a few things you already enjoy." },
    ],
  }),
  component: InterestsPage,
});

function InterestsPage() {
  const nav = useNavigate();
  const { session, user } = useApp();
  const [interests, setInterests] = useState<UserInterestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<string>("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");

  // New interest form
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState<string>(INTEREST_CATEGORIES[0]);
  const [newIntensity, setNewIntensity] = useState(4);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      nav({ to: "/login" });
      return;
    }
    if (!user) return;
    setFullName(user.full_name ?? "");
    setAge(user.age != null ? String(user.age) : "");
    setCity(user.city ?? "");
    setBio(user.short_bio ?? "");
    listMyInterests(user.id)
      .then(setInterests)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [session, user, nav]);

  if (!session || !user) {
    return (
      <MobileShell showNav={false}>
        <div className="px-6 pt-16 text-[14px] text-[#374151]">Sign in to manage your interests.</div>
      </MobileShell>
    );
  }

  const saveProfile = async () => {
    try {
      await updateProfile(user.id, {
        full_name: fullName || null as any,
        age: age ? Number(age) : null,
        city: city || null as any,
        short_bio: bio || null,
      });
      setSavedNote("Saved");
      setTimeout(() => setSavedNote(null), 1500);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const onAdd = async () => {
    if (!newName.trim()) return;
    try {
      const row = await addInterest({
        userId: user.id,
        interest_name: newName.trim(),
        interest_category: newCat,
        intensity: newIntensity,
      });
      setInterests((prev) => [row, ...prev]);
      setNewName("");
      setNewIntensity(4);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const onUpdate = async (id: string, patch: Partial<UserInterestRow>) => {
    setInterests((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    try {
      await updateInterest(id, patch as any);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const onDelete = async (id: string) => {
    setInterests((prev) => prev.filter((i) => i.id !== id));
    try {
      await removeInterest(id);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <MobileShell>
      <div className="px-4 pt-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/settings" className="text-forest p-2 -ml-2"><ArrowLeft size={20} /></Link>
          <div>
            <p className="micro-label">Personal</p>
            <h1 className="text-[22px] font-bold leading-tight">My Interests</h1>
          </div>
        </div>

        <p className="text-[13px] text-[#374151] mb-4">
          Pick a few things you already enjoy. Rate how interested you are. You can change this later.
        </p>

        <section className="card-soft p-4 mb-5">
          <p className="micro-label mb-2">Profile</p>
          <div className="space-y-2">
            <input
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Age"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]"
              />
              <input
                placeholder="City (e.g. Rotterdam)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]"
              />
            </div>
            <textarea
              placeholder="Short bio (optional, kept private)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px] resize-none"
            />
            <button
              onClick={saveProfile}
              className="w-full bg-turquoise text-white font-semibold py-3 rounded-xl text-[14px]"
            >
              Save profile {savedNote && <span className="text-[12px] opacity-80">· {savedNote}</span>}
            </button>
          </div>
        </section>

        <section className="card-soft p-4 mb-4">
          <p className="micro-label mb-2">Add an interest</p>
          <input
            placeholder="e.g. Basketball, Chess, Community dinners"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px] mb-2"
          />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]"
            >
              {INTEREST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <IntensityPicker value={newIntensity} onChange={setNewIntensity} />
          </div>
          <button
            onClick={onAdd}
            disabled={!newName.trim()}
            className="w-full bg-turquoise text-white font-semibold py-3 rounded-xl text-[14px] inline-flex items-center justify-center gap-1 disabled:opacity-50"
          >
            <Plus size={14} /> Add interest
          </button>
        </section>

        {err && <p className="text-[13px] text-boundary mb-2">{err}</p>}

        <p className="micro-label mb-2">Your interests ({interests.length})</p>
        {loading && <p className="text-[13px] text-forest/60">Loading…</p>}
        {!loading && interests.length === 0 && (
          <div className="card-soft p-4 text-[13px] text-forest/60">No interests yet. Add one above.</div>
        )}
        <div className="space-y-2">
          {interests.map((i) => (
            <div key={i.id} className="card-soft p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-forest leading-tight">{i.interest_name}</p>
                  <select
                    value={i.interest_category ?? INTEREST_CATEGORIES[0]}
                    onChange={(e) => onUpdate(i.id, { interest_category: e.target.value })}
                    className="mt-1 bg-canvas rounded-md px-2 py-1 text-[12px] outline-none"
                  >
                    {INTEREST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button onClick={() => onDelete(i.id)} className="text-boundary p-1.5" aria-label="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-2">
                <IntensityPicker value={i.intensity} onChange={(v) => onUpdate(i.id, { intensity: v })} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link to="/suggested" className="block text-center text-[13px] text-turquoise font-semibold">
            See suggested events →
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

function IntensityPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5 bg-canvas rounded-xl px-2 py-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`flex-1 h-7 rounded-md text-[12px] font-semibold ${
            value >= n ? "bg-turquoise text-white" : "bg-white text-forest/50"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { authService } from "@/services/authService";
import { zones } from "@/lib/mock-data";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Haven" }] }),
  component: SignUp,
});

function SignUp() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"resident" | "organiser">("resident");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<any>("community_center");
  const [zoneId, setZoneId] = useState("kralingen");
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tab === "resident") {
        await authService.signUpResident({ email, password });
        nav({ to: "/onboarding" });
      } else {
        await authService.signUpOrganiser({ email, password, name, type, zoneId });
        nav({ to: "/verify" });
      }
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <MobileShell showNav={false}>
      <div className="px-6 pt-12 pb-8 min-h-screen flex flex-col">
        <h1 className="text-[26px] font-bold">Create your account</h1>
        <p className="text-[14px] text-[#374151] mt-2">Pick what fits you.</p>

        <div className="card-soft bg-white p-1 mt-5 grid grid-cols-2 gap-1">
          {(["resident", "organiser"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-2.5 text-[13px] font-semibold rounded-lg capitalize ${tab === t ? "bg-turquoise text-white" : "text-forest/70"}`}>
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          {tab === "organiser" && (
            <>
              <input required placeholder="Organisation name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]" />
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]">
                <option value="municipality_department">Municipality department</option>
                <option value="sports_club">Sports club</option>
                <option value="library">Library</option>
                <option value="school">School</option>
                <option value="university">University</option>
                <option value="community_center">Community center</option>
                <option value="ngo">NGO</option>
                <option value="neighbourhood_volunteer">Verified neighbourhood volunteer</option>
              </select>
              <select value={zoneId} onChange={(e) => setZoneId(e.target.value)}
                className="w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]">
                {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </>
          )}
          <input type="email" required placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]" />
          <input type="password" required minLength={4} placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]" />
          {err && <p className="text-[13px] text-boundary">{err}</p>}
          <button className="w-full bg-turquoise text-white font-semibold py-3.5 rounded-xl">
            Create account
          </button>
        </form>
        <div className="mt-5 text-[13px] text-forest/70 text-center">
          Have an account? <Link to="/login" className="text-turquoise font-semibold">Sign in</Link>
        </div>
      </div>
    </MobileShell>
  );
}

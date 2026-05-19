import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Haven" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const s = await authService.signIn(email, password);
      if (s.role === "resident") {
        const u = userService.getById(s.profile_id);
        nav({ to: u?.onboarding_complete ? "/" : "/onboarding" });
      } else if (s.role === "organiser") nav({ to: "/organiser" });
      else nav({ to: "/municipality" });
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <MobileShell showNav={false}>
      <div className="px-6 pt-16 pb-8 min-h-screen flex flex-col">
        <div className="text-5xl mb-3">🌿</div>
        <h1 className="text-[28px] font-bold">Welcome back</h1>
        <p className="text-[14px] text-[#374151] mt-2">Sign in to Haven.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input type="email" required placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]" />
          <input type="password" required placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]" />
          {err && <p className="text-[13px] text-boundary">{err}</p>}
          <button className="w-full bg-turquoise text-white font-semibold py-3.5 rounded-xl">Sign in</button>
        </form>
        <div className="mt-5 text-[13px] text-forest/70 text-center">
          New here? <Link to="/signup" className="text-turquoise font-semibold">Create an account</Link>
        </div>
        <button
          onClick={async () => { await authService.signInAdmin(); nav({ to: "/municipality" }); }}
          className="mt-6 w-full text-[12px] text-forest/60 underline inline-flex items-center justify-center gap-1"
        >
          <ShieldCheck size={12} /> Continue as Municipality admin (demo)
        </button>
      </div>
    </MobileShell>
  );
}

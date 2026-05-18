import { r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { a as useNavigate, L as Link, b as authService, e as userService } from "./router-qGr_Hydj.js";
import { M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import { S as ShieldCheck } from "./shield-check-DFAFFWRq.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
function Login() {
  const nav = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [err, setErr] = reactExports.useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const s = await authService.signIn(email, password);
      if (s.role === "resident") {
        const u = userService.getById(s.profile_id);
        nav({
          to: u?.onboarding_complete ? "/" : "/onboarding"
        });
      } else if (s.role === "organiser") nav({
        to: "/organiser"
      });
      else nav({
        to: "/municipality"
      });
    } catch (e2) {
      setErr(e2.message);
    }
  };
  const demoLogin = async (role) => {
    setErr(null);
    try {
      if (role === "resident") {
        const s = await authService.signIn("resident@demo.nl", "demo");
        const u = userService.getById(s.profile_id);
        nav({
          to: u?.onboarding_complete ? "/" : "/onboarding"
        });
      } else if (role === "organiser") {
        await authService.signIn("demo@rotterdam.nl", "demo");
        nav({
          to: "/organiser"
        });
      } else {
        await authService.signInAdmin();
        nav({
          to: "/municipality"
        });
      }
    } catch (e) {
      setErr(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { showNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-16 pb-8 min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "🌿" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[28px] font-bold", children: "Welcome back" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151] mt-2", children: "Sign in to BuurtMatch." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]" }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-boundary", children: err }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full bg-turquoise text-white font-semibold py-3.5 rounded-xl", children: "Sign in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 text-[13px] text-forest/70 text-center", children: [
      "New here? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-turquoise font-semibold", children: "Create an account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => demoLogin("resident"), className: "w-full bg-canvas text-forest font-semibold py-3 rounded-xl text-[13px]", type: "button", children: "Continue as resident demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => demoLogin("organiser"), className: "w-full bg-canvas text-forest font-semibold py-3 rounded-xl text-[13px]", type: "button", children: "Continue as organiser demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => demoLogin("admin"), className: "w-full text-[12px] text-forest/60 underline inline-flex items-center justify-center gap-1", type: "button", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 12 }),
        " Continue as Municipality admin demo"
      ] })
    ] })
  ] }) });
}
export {
  Login as component
};

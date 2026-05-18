import { r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { a as useNavigate, z as zones, L as Link, b as authService } from "./router-qGr_Hydj.js";
import { M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
function SignUp() {
  const nav = useNavigate();
  const [tab, setTab] = reactExports.useState("resident");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [type, setType] = reactExports.useState("community_center");
  const [zoneId, setZoneId] = reactExports.useState("kralingen");
  const [err, setErr] = reactExports.useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tab === "resident") {
        await authService.signUpResident({
          email,
          password
        });
        nav({
          to: "/onboarding"
        });
      } else {
        await authService.signUpOrganiser({
          email,
          password,
          name,
          type,
          zoneId
        });
        nav({
          to: "/verify"
        });
      }
    } catch (e2) {
      setErr(e2.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { showNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-12 pb-8 min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[26px] font-bold", children: "Create your account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151] mt-2", children: "Pick what fits you." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft bg-white p-1 mt-5 grid grid-cols-2 gap-1", children: ["resident", "organiser"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), className: `py-2.5 text-[13px] font-semibold rounded-lg capitalize ${tab === t ? "bg-turquoise text-white" : "text-forest/70"}`, children: t }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-5 space-y-3", children: [
      tab === "organiser" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, placeholder: "Organisation name", value: name, onChange: (e) => setName(e.target.value), className: "w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: type, onChange: (e) => setType(e.target.value), className: "w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "municipality_department", children: "Municipality department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sports_club", children: "Sports club" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "library", children: "Library" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "school", children: "School" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "university", children: "University" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "community_center", children: "Community center" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ngo", children: "NGO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "neighbourhood_volunteer", children: "Verified neighbourhood volunteer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: zoneId, onChange: (e) => setZoneId(e.target.value), className: "w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]", children: zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: z.id, children: z.name }, z.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, minLength: 4, placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-canvas rounded-xl px-4 py-3.5 outline-none text-[14px]" }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-boundary", children: err }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full bg-turquoise text-white font-semibold py-3.5 rounded-xl", children: "Create account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 text-[13px] text-forest/70 text-center", children: [
      "Have an account? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-turquoise font-semibold", children: "Sign in" })
    ] })
  ] }) });
}
export {
  SignUp as component
};

import { r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { u as useApp, a as useNavigate, c as ageRanges, z as zones, i as interests } from "./router-qGr_Hydj.js";
import { M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import { A as ArrowLeft } from "./arrow-left-CQYCycJO.js";
import { C as Check } from "./check-DJZ37po8.js";
import { C as ChevronRight } from "./chevron-right-ffvthshb.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
function Onboarding() {
  const {
    prefs,
    setPrefs,
    session
  } = useApp();
  const nav = useNavigate();
  reactExports.useEffect(() => {
    if (!session) nav({
      to: "/login"
    });
  }, [session, nav]);
  const [step, setStep] = reactExports.useState(0);
  const [ageRange, setAgeRange] = reactExports.useState(prefs.ageRange);
  const [gender, setGender] = reactExports.useState(prefs.gender);
  const [zoneId, setZoneId] = reactExports.useState(prefs.zoneId);
  const [picked, setPicked] = reactExports.useState(prefs.interests);
  const [notif, setNotif] = reactExports.useState(prefs.notifications);
  const toggleInterest = (id) => setPicked((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const finish = () => {
    setPrefs({
      onboarded: true,
      ageRange,
      gender,
      zoneId,
      interests: picked,
      notifications: notif
    });
    nav({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { showNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-12 pb-8 min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      step > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: back, className: "text-forest p-2 -ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", children: [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1 rounded-full transition-all ${i <= step ? "w-6 bg-turquoise" : "w-3 bg-forest/15"}` }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: finish, className: "text-[12px] text-forest/50", children: "Skip" })
    ] }),
    step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-4", children: "👋" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[28px] font-bold leading-tight", children: "Welcome to BuurtMatch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] text-[#374151] mt-3 leading-relaxed", children: "Find nearby activities and join small groups without the awkward first step. Backed by your municipality." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft p-4 mt-6 bg-success/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-forest leading-relaxed", children: "We only use the preferences you choose. No public profiles, no ratings, no open chats, and no loneliness scores." }) })
    ] }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[24px] font-bold", children: "Your age range" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151] mt-2", children: "Helps us only show events you're eligible for. Adults only (18+)." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 mt-6", children: ageRanges.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAgeRange(a), className: `py-4 rounded-xl border-2 font-semibold transition-all ${ageRange === a ? "border-turquoise bg-turquoise text-white" : "border-border bg-white text-forest"}`, children: a }, a)) })
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[24px] font-bold", children: "Gender" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151] mt-2", children: "Optional, only used when relevant for comfort or safety preferences." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 mt-6", children: ["Male", "Female", "Other", "Prefer not to say"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setGender(g), className: `flex items-center justify-between px-4 py-4 rounded-xl border-2 text-left transition-all ${gender === g ? "border-turquoise bg-turquoise/10" : "border-border bg-white"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-forest", children: g }),
        gender === g && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18, className: "text-turquoise" })
      ] }, g)) })
    ] }),
    step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[24px] font-bold", children: "Your neighbourhood" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151] mt-2", children: "Pick a zone. You can change this anytime." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 mt-6 max-h-[60vh] overflow-auto", children: zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setZoneId(z.id), className: `flex items-center justify-between px-4 py-4 rounded-xl border-2 text-left transition-all ${zoneId === z.id ? "border-turquoise bg-turquoise/10" : "border-border bg-white"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-forest", children: z.name }),
        zoneId === z.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18, className: "text-turquoise" })
      ] }, z.id)) })
    ] }),
    step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[24px] font-bold", children: "What are you into?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151] mt-2", children: "Tap a bubble. Tap again to expand into specifics." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-6", children: interests.map((i) => {
        const on = picked.includes(i.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleInterest(i.id), className: `px-4 py-2.5 rounded-xl border font-medium text-[14px] transition-all ${on ? "bg-turquoise text-white border-turquoise" : "bg-canvas text-forest border-forest/15"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1.5", children: i.icon }),
          i.name
        ] }, i.id);
      }) }),
      picked.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-4", children: interests.filter((i) => picked.includes(i.id)).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "micro-label mb-2", children: [
          i.name,
          " — specifics (optional)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: i.subs.map((s) => {
          const on = picked.includes(s);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleInterest(s), className: `px-3 py-1.5 rounded-xl border text-[13px] transition-all ${on ? "bg-turquoise text-white border-turquoise" : "bg-white text-forest border-forest/15"}`, children: s }, s);
        }) })
      ] }, i.id)) })
    ] }),
    step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[24px] font-bold", children: "Notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151] mt-2", children: "Bright and low-pressure. Change anytime." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 mt-6", children: [["nearby", "Nearby events"], ["recommended", "Recommended events"], ["startingSoon", "Events starting soon"], ["quiet", "Quiet activities"], ["team", "Team activities"], ["weekend", "Weekend events"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between px-4 py-4 rounded-xl bg-white border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-forest", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { on: !!notif[k], onChange: (v) => setNotif({
          ...notif,
          [k]: v
        }) })
      ] }, k)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6", children: step < 5 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: next, disabled: step === 1 && !ageRange, className: "w-full bg-turquoise text-white font-semibold py-4 rounded-xl shadow-soft inline-flex items-center justify-center gap-2 disabled:opacity-40", children: [
      "Continue ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 18 })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: finish, className: "w-full bg-turquoise text-white font-semibold py-4 rounded-xl shadow-soft", children: "Continue to Map" }) })
  ] }) });
}
function Toggle({
  on,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange(!on), className: `w-11 h-6 rounded-full transition-colors relative ${on ? "bg-turquoise" : "bg-forest/15"}`, "aria-pressed": on, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}` }) });
}
export {
  Onboarding as component
};

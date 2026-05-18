import { T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { u as useApp, a as useNavigate, z as zones, c as ageRanges, i as interests, L as Link } from "./router-qGr_Hydj.js";
import { c as createLucideIcon, M as MobileShell, B as Building2 } from "./MobileShell-UfNoLGH9.js";
import { M as MapPin } from "./map-pin-CjSQ6_AJ.js";
import { S as Sparkles } from "./sparkles-Be9Zhoed.js";
import { A as Accessibility } from "./accessibility-CvWLjJ09.js";
import { S as ShieldCheck } from "./shield-check-DFAFFWRq.js";
import { C as ChevronRight } from "./chevron-right-ffvthshb.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
const __iconNode$3 = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      key: "3c2336"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const BadgeCheck = createLucideIcon("badge-check", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$2);
const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);
const __iconNode = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode);
function Settings() {
  const {
    prefs,
    setPrefs,
    resetAll,
    session,
    user,
    organiser,
    signOut,
    deleteMyData
  } = useApp();
  const nav = useNavigate();
  const toggle = (id) => {
    const has = prefs.interests.includes(id);
    setPrefs({
      interests: has ? prefs.interests.filter((x) => x !== id) : [...prefs.interests, id]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-6 pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[24px] font-bold", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151] mt-1", children: "Your preferences. Always editable." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2.5 mt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LinkCard, { to: "/interests", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 18 }), title: "My Interests", sub: "Pick what you enjoy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LinkCard, { to: "/suggested", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 18 }), title: "Suggested Events", sub: "Small group meetups" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LinkCard, { to: "/organiser", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 18 }), title: "Organiser Hub", sub: "Create and manage events" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LinkCard, { to: "/verify", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { size: 18 }), title: "Get Verified", sub: "Demo verification" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LinkCard, { to: "/municipality", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 18 }), title: "Municipality", sub: "Dashboard preview" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16 }), title: "Location & age", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Neighbourhood", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: prefs.zoneId, onChange: (e) => setPrefs({
        zoneId: e.target.value
      }), className: "bg-canvas rounded-lg px-3 py-2 text-[13px] font-semibold text-forest outline-none", children: zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: z.id, children: z.name }, z.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: `Radius: ${prefs.radiusKm}km`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 1, max: 10, value: prefs.radiusKm, onChange: (e) => setPrefs({
        radiusKm: Number(e.target.value)
      }), className: "w-32 accent-[var(--turquoise)]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Age range", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: prefs.ageRange ?? "", onChange: (e) => setPrefs({
        ageRange: e.target.value
      }), className: "bg-canvas rounded-lg px-3 py-2 text-[13px] font-semibold text-forest outline-none", children: ageRanges.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a, children: a }, a)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Gender (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: prefs.gender ?? "Prefer not to say", onChange: (e) => setPrefs({
        gender: e.target.value
      }), className: "bg-canvas rounded-lg px-3 py-2 text-[13px] font-semibold text-forest outline-none", children: ["Male", "Female", "Other", "Prefer not to say"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: g, children: g }, g)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 16 }), title: "Interests", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: interests.map((i) => {
      const on = prefs.interests.includes(i.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggle(i.id), className: `px-3.5 py-2 rounded-xl border text-[13px] font-medium ${on ? "bg-turquoise text-white border-turquoise" : "bg-canvas text-forest border-forest/15"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: i.icon }),
        i.name
      ] }, i.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 16 }), title: "Notifications", children: [["nearby", "Nearby events"], ["recommended", "Recommended events"], ["startingSoon", "Starting soon"], ["quiet", "Quiet activities"], ["team", "Team activities"], ["weekend", "Weekend events"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { on: !!prefs.notifications[k], onChange: (v) => setPrefs({
      notifications: {
        ...prefs.notifications,
        [k]: v
      }
    }) }) }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Accessibility, { size: 16 }), title: "Accessibility", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Reduce motion", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { on: prefs.accessibility.reducedMotion, onChange: (v) => setPrefs({
        accessibility: {
          ...prefs.accessibility,
          reducedMotion: v
        }
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "High contrast", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { on: prefs.accessibility.highContrast, onChange: (v) => setPrefs({
        accessibility: {
          ...prefs.accessibility,
          highContrast: v
        }
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Colorblind theme", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { on: prefs.accessibility.colorblind, onChange: (v) => setPrefs({
        accessibility: {
          ...prefs.accessibility,
          colorblind: v
        }
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: `Font size: ${Math.round(prefs.accessibility.fontScale * 100)}%`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 0.85, max: 1.4, step: 0.05, value: prefs.accessibility.fontScale, onChange: (e) => setPrefs({
        accessibility: {
          ...prefs.accessibility,
          fontScale: Number(e.target.value)
        }
      }), className: "w-32 accent-[var(--turquoise)]" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16 }), title: "Privacy", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Pause recommendations", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { on: prefs.privacy.pauseRecs, onChange: (v) => setPrefs({
        privacy: {
          ...prefs.privacy,
          pauseRecs: v
        }
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Hide me from matching", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { on: prefs.privacy.hideFromMatching, onChange: (v) => setPrefs({
        privacy: {
          ...prefs.privacy,
          hideFromMatching: v
        }
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        if (confirm("Delete all your data? This cannot be undone.")) {
          deleteMyData();
          nav({
            to: "/login"
          });
        }
      }, className: "w-full text-left px-1 py-3 text-[13px] text-boundary font-semibold", children: "Delete my data" })
    ] }),
    session && /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 }), title: "Account", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: session.role === "resident" ? "Resident" : session.role === "organiser" ? `Organiser · ${organiser?.name ?? ""}` : "Municipality admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-forest/60", children: [
        session.profile_id.slice(0, 12),
        "…"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        signOut();
        nav({
          to: "/login"
        });
      }, className: "w-full text-left px-1 py-3 text-[13px] text-forest font-semibold inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 14 }),
        " Sign out"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft mt-5 p-4 bg-success/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 16, className: "text-success mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-forest leading-relaxed", children: "No public profiles. No chats. No ratings. No loneliness scores. Your municipality sees only aggregated data." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: resetAll, className: "mt-5 text-[12px] text-forest/40 underline", children: "Reset prototype data" })
  ] }) });
}
function Section({
  icon,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2.5 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-turquoise", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft px-4 divide-y divide-border", children })
  ] });
}
function Row({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[14px] text-forest font-medium", children: label }),
    children
  ] });
}
function Toggle({
  on,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange(!on), className: `w-11 h-6 rounded-full relative transition-colors ${on ? "bg-turquoise" : "bg-forest/15"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : ""}` }) });
}
function LinkCard({
  to,
  icon,
  title,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "card-soft p-4 flex items-center gap-3 active:scale-[0.99] transition-transform", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-turquoise/15 text-turquoise flex items-center justify-center", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-semibold text-forest leading-tight", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-forest/60", children: sub })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-forest/30" })
  ] });
}
export {
  Settings as component
};

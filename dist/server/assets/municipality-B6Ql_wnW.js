import { T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { L as Link, m as municipalityMetrics } from "./router-qGr_Hydj.js";
import { c as createLucideIcon, M as MobileShell, C as Calendar, B as Building2 } from "./MobileShell-UfNoLGH9.js";
import { A as ArrowLeft } from "./arrow-left-CQYCycJO.js";
import { U as Users } from "./users-PcxgCcOz.js";
import { M as MapPin } from "./map-pin-CjSQ6_AJ.js";
import { S as ShieldCheck } from "./shield-check-DFAFFWRq.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function Municipality() {
  const m = municipalityMetrics;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "text-forest p-2 -ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "Gemeente Rotterdam" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] font-bold leading-tight", children: "Civic dashboard" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }), label: "Events this month", value: m.eventsThisMonth }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }), label: "Total attendances", value: m.totalAttendances }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }), label: "First-time participants", value: `${m.firstTimePercent}%` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 14 }), label: "Individual profiles accessible", value: m.individualProfilesAccessible, highlight: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label mb-2", children: "Hobby demand" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft divide-y divide-border", children: m.hobbyTrends.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-semibold text-forest leading-tight", children: t.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-forest/60", children: t.zone })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-semibold text-success", children: t.delta })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label mb-2", children: "Geographic activity heatmap" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: m.heatmap.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[12px] text-forest mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
            " ",
            h.zone
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-forest/50", children: [
            Math.round(h.intensity * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 bg-canvas rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-turquoise", style: {
          width: `${h.intensity * 100}%`
        } }) })
      ] }, h.zone)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft mt-6 p-4 bg-success/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 16, className: "text-success mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-forest leading-relaxed", children: "Municipality sees aggregated counts only. No single-user tracking, no loneliness scores, no individual profiles." })
    ] }) })
  ] }) });
}
function Stat({
  icon,
  label,
  value,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `card-soft p-4 ${highlight ? "bg-success/5" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-forest/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-turquoise", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider font-semibold", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[26px] font-bold text-forest mt-1.5 leading-none", children: value })
  ] });
}
export {
  Municipality as component
};

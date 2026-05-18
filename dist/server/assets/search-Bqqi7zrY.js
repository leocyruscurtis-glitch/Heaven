import { T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { R as Route, u as useApp, z as zones, L as Link } from "./router-qGr_Hydj.js";
import { M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import { E as EventCard } from "./EventCard-CtMOFATR.js";
import { u as useLegacyEvents } from "./use-events-DgS0mPMR.js";
import { A as ArrowLeft } from "./arrow-left-CQYCycJO.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
import "./users-PcxgCcOz.js";
import "./sparkles-Be9Zhoed.js";
import "./shield-check-DFAFFWRq.js";
import "./accessibility-CvWLjJ09.js";
function SearchResults() {
  const {
    q
  } = Route.useSearch();
  const {
    prefs
  } = useApp();
  const zone = zones.find((z) => z.id === prefs.zoneId);
  const events = useLegacyEvents();
  const matches = events.filter((e) => {
    if (!q) return true;
    const haystack = `${e.title} ${e.category} ${e.subcategory}`.toLowerCase();
    return haystack.includes(q.toLowerCase());
  });
  const inside = matches.filter((e) => e.zoneId === prefs.zoneId);
  const outside = matches.filter((e) => e.zoneId !== prefs.zoneId);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-forest p-2 -ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "Results" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] font-bold leading-tight", children: q || "All events" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "micro-label mb-3", children: [
      "Inside your current radius — ",
      zone.name
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      inside.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { text: "Nothing here yet. Try widening your radius." }),
      inside.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event: e }, e.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label mt-7 mb-3", children: "Outside your current radius" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      outside.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { text: "No nearby alternatives matched." }),
      outside.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event: e }, e.id))
    ] })
  ] }) });
}
function Empty({
  text
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft p-5 text-center text-[13px] text-forest/60", children: text });
}
export {
  SearchResults as component
};

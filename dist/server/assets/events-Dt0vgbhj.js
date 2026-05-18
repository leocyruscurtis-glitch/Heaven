import { r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { u as useApp, a as useNavigate } from "./router-qGr_Hydj.js";
import { M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import { E as EventCard } from "./EventCard-CtMOFATR.js";
import { u as useLegacyEvents } from "./use-events-DgS0mPMR.js";
import { S as Search } from "./search-DgrFK_jR.js";
import { S as Sparkles } from "./sparkles-Be9Zhoed.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
import "./users-PcxgCcOz.js";
import "./shield-check-DFAFFWRq.js";
import "./accessibility-CvWLjJ09.js";
function EventsTab() {
  const {
    prefs
  } = useApp();
  const nav = useNavigate();
  const [q, setQ] = reactExports.useState("");
  const events = useLegacyEvents();
  const recommended = reactExports.useMemo(() => {
    if (prefs.privacy.pauseRecs) return [];
    const userInterests = prefs.interests.map((i) => i.toLowerCase());
    return events.filter((e) => e.startInMin >= 0).map((e) => {
      let score = 0;
      if (userInterests.length === 0) score = 1;
      if (userInterests.some((i) => e.category.toLowerCase().includes(i) || e.subcategory.toLowerCase().includes(i) || i.includes(e.category.toLowerCase()))) score += 3;
      if (e.zoneId === prefs.zoneId) score += 2;
      if (e.beginnerFriendly) score += 1;
      if (e.distanceKm <= prefs.radiusKm) score += 1;
      return {
        e,
        score
      };
    }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((x) => x.e);
  }, [prefs]);
  const suggestions = reactExports.useMemo(() => {
    if (!q) return [];
    const opts = [...new Set(events.flatMap((e) => [e.category, e.subcategory, e.locationName]))];
    return opts.filter((o) => o.toLowerCase().startsWith(q.toLowerCase())).slice(0, 4);
  }, [q]);
  const results = reactExports.useMemo(() => {
    if (!q) return [];
    const h = q.toLowerCase();
    return events.filter((e) => `${e.title} ${e.category} ${e.subcategory} ${e.locationName}`.toLowerCase().includes(h));
  }, [q]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-6 pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[24px] font-bold", children: "Events" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151] mt-1", children: "Tailored to your preferences. Tap to see details." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft mt-5 p-2 bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "text-forest/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), onKeyDown: (e) => e.key === "Enter" && q && nav({
          to: "/search",
          search: {
            q
          }
        }), placeholder: "Search location, hobby, or category", className: "flex-1 py-2.5 text-[14px] outline-none bg-transparent placeholder:text-forest/40" })
      ] }),
      suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border mt-1 pt-1", children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setQ("");
        nav({
          to: "/search",
          search: {
            q: s
          }
        });
      }, className: "w-full text-left px-3 py-2 rounded-lg hover:bg-canvas text-[14px] text-forest", children: s }, s)) })
    ] }),
    q && results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "micro-label mb-3", children: [
        'Matching "',
        q,
        '"'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: results.slice(0, 6).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event: e, withReason: false }, e.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14, className: "text-turquoise" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "Recommended for you" })
      ] }),
      prefs.privacy.pauseRecs ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft p-5 text-center text-[13px] text-forest/60", children: "Recommendations paused. Resume in Settings." }) : recommended.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft p-5 text-center text-[13px] text-forest/60", children: "Add interests in Settings to get recommendations." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: recommended.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event: e }, e.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft mt-6 p-4 bg-success/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] font-semibold text-forest", children: "Why are these shown?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-[#374151] mt-1 leading-relaxed", children: "We only use the preferences you choose. No public profiles, no ratings, no open chats, and no loneliness scores. Manage anytime in Settings." })
    ] })
  ] }) });
}
export {
  EventsTab as component
};

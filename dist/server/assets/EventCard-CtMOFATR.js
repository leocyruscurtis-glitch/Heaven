import { T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { L as Link } from "./router-qGr_Hydj.js";
import { U as Users } from "./users-PcxgCcOz.js";
import { S as Sparkles } from "./sparkles-Be9Zhoed.js";
import { S as ShieldCheck } from "./shield-check-DFAFFWRq.js";
import { A as Accessibility } from "./accessibility-CvWLjJ09.js";
function StatusPill({ status }) {
  const map = {
    live: { label: "Live now", cls: "bg-turquoise text-white" },
    scheduled: { label: "Scheduled", cls: "bg-forest/5 text-forest" },
    "almost-full": { label: "Almost full", cls: "bg-amber-100 text-amber-800" },
    full: { label: "Full", cls: "bg-forest/10 text-forest" },
    "at-risk": { label: "At risk", cls: "bg-red-50 text-boundary" },
    cancelled: { label: "Cancelled", cls: "bg-boundary/10 text-boundary" },
    "minimum-reached": { label: "Min reached", cls: "bg-success/15 text-forest" }
  };
  const v = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-semibold px-2 py-1 rounded-md ${v.cls}`, children: v.label });
}
function EventCard({ event, withReason = true }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/event/$id",
      params: { id: event.id },
      className: "card-soft block p-4 active:scale-[0.99] transition-transform",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl w-10 h-10 rounded-xl bg-canvas flex items-center justify-center shrink-0", children: event.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[17px] font-semibold leading-tight text-forest", children: event.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: event.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[13px] text-[#374151] mt-1", children: [
            event.startTime,
            " · ",
            event.locationName,
            " · ",
            event.distanceKm,
            "km"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-2.5", children: [
            event.beginnerFriendly && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] px-2 py-1 rounded-md bg-success/10 text-forest font-medium", children: "Beginner-friendly" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] px-2 py-1 rounded-md bg-canvas text-forest font-medium", children: [
              event.maxCapacity - event.currentRegistration,
              " open spots"
            ] }),
            event.peopleComeAlone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] px-2 py-1 rounded-md bg-canvas text-forest font-medium inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 11 }),
              " often solo"
            ] }),
            event.welcomeHost && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] px-2 py-1 rounded-md bg-canvas text-forest font-medium inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 11 }),
              " welcome host"
            ] }),
            event.organiserVerified && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] px-2 py-1 rounded-md bg-turquoise/10 text-forest font-medium inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 11 }),
              " verified"
            ] }),
            event.accessibility && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] px-2 py-1 rounded-md bg-canvas text-forest font-medium inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Accessibility, { size: 11 }),
              " accessible"
            ] })
          ] }),
          withReason && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label mt-3 normal-case tracking-normal text-[11px] opacity-60", children: event.recommendationReason })
        ] })
      ] })
    }
  );
}
export {
  EventCard as E
};

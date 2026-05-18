import { r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { g as Route, h as events, u as useApp, L as Link } from "./router-qGr_Hydj.js";
import { c as createLucideIcon, M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import { u as useLegacyEvents } from "./use-events-DgS0mPMR.js";
import { A as ArrowLeft } from "./arrow-left-CQYCycJO.js";
import { M as MapPin } from "./map-pin-CjSQ6_AJ.js";
import { U as Users } from "./users-PcxgCcOz.js";
import { S as ShieldCheck } from "./shield-check-DFAFFWRq.js";
import { A as Accessibility } from "./accessibility-CvWLjJ09.js";
import { S as Sparkles } from "./sparkles-Be9Zhoed.js";
import { C as Check } from "./check-DJZ37po8.js";
import { E as Eye } from "./eye-BTtw4WmP.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
const __iconNode$5 = [
  ["path", { d: "M16 14v2.2l1.6 1", key: "fo4ql5" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", key: "1osxxc" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
];
const CalendarClock = createLucideIcon("calendar-clock", __iconNode$5);
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528",
      key: "1jaruq"
    }
  ]
];
const Flag = createLucideIcon("flag", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16", key: "1v1a37" }],
  [
    "path",
    {
      d: "m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95",
      key: "fhfbnt"
    }
  ],
  ["path", { d: "m2 15 6 6", key: "10dquu" }],
  [
    "path",
    {
      d: "m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91",
      key: "1x6kdw"
    }
  ]
];
const HandHeart = createLucideIcon("hand-heart", __iconNode$2);
const __iconNode$1 = [
  ["rect", { width: "5", height: "5", x: "3", y: "3", rx: "1", key: "1tu5fj" }],
  ["rect", { width: "5", height: "5", x: "16", y: "3", rx: "1", key: "1v8r4q" }],
  ["rect", { width: "5", height: "5", x: "3", y: "16", rx: "1", key: "1x03jg" }],
  ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3", key: "177gqh" }],
  ["path", { d: "M21 21v.01", key: "ents32" }],
  ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7", key: "8crl2c" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M12 3h.01", key: "n36tog" }],
  ["path", { d: "M12 16v.01", key: "133mhm" }],
  ["path", { d: "M16 12h1", key: "1slzba" }],
  ["path", { d: "M21 12v.01", key: "1lwtk9" }],
  ["path", { d: "M12 21v-1", key: "1880an" }]
];
const QrCode = createLucideIcon("qr-code", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
const SOFT = [{
  state: "Interested",
  icon: HandHeart,
  sub: "Saved. We’ll keep this visible for you."
}, {
  state: "Maybe",
  icon: Sparkles,
  sub: "No pressure. We’ll remind you later."
}, {
  state: "Join",
  icon: Check,
  sub: "You’re in. Arrival help will appear before the event."
}, {
  state: "Remind me later",
  icon: CalendarClock,
  sub: "We’ll nudge you closer to the time."
}, {
  state: "Bring a friend",
  icon: UserPlus,
  sub: "You can show up together."
}, {
  state: "Spectator",
  icon: Eye,
  sub: "You can attend without participating at first."
}];
function EventDetail() {
  const {
    id
  } = Route.useParams();
  const liveEvents = useLegacyEvents();
  const event = liveEvents.find((e) => e.id === id) ?? events.find((e) => e.id === id);
  const {
    registrations,
    setRegistration
  } = useApp();
  const [confirm, setConfirm] = reactExports.useState(null);
  if (!event) return null;
  const reg = registrations.find((r) => r.eventId === event.id);
  const joined = reg?.state === "Join";
  const openSpots = event.maxCapacity - event.currentRegistration;
  const onPick = (state, sub) => {
    setRegistration(event.id, state);
    setConfirm({
      state,
      sub
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MobileShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-forest p-2 -ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] px-2.5 py-1 rounded-md bg-canvas font-semibold text-forest", children: event.category })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl w-14 h-14 rounded-2xl bg-canvas flex items-center justify-center", children: event.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] font-bold leading-tight", children: event.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-[#374151] mt-1", children: event.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14 }), label: "When", value: event.startTime }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }), label: "Where", value: event.locationName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }), label: "Open spots", value: `${openSpots} of ${event.maxCapacity}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 }), label: "Organiser", value: event.organiser, verified: event.organiserVerified })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-4", children: [
          event.beginnerFriendly && /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: "Beginner-friendly" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: event.skillLevel }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { children: [
            "Age ",
            event.ageRangeMin,
            "+"
          ] }),
          event.peopleComeAlone && /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: "People often come alone" }),
          event.welcomeHost && /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { children: "Welcome host present" }),
          event.teamBased && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tag, { children: [
            "Teams of ",
            event.teamSize
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-3 rounded-xl bg-success/5 flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Accessibility, { size: 14, className: "text-forest mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-forest leading-relaxed", children: event.accessibility })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label mt-4 normal-case tracking-normal text-[12px] opacity-60", children: event.recommendationReason })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 card-soft p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-semibold text-forest", children: "Capacity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-forest/60", children: [
            event.currentRegistration,
            "/",
            event.maxCapacity,
            " registered · min ",
            event.minCapacity
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-canvas rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-turquoise transition-all", style: {
          width: `${Math.min(100, event.currentRegistration / event.maxCapacity * 100)}%`
        } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[17px] font-bold mt-6 mb-3", children: "How do you want to join?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2.5", children: SOFT.map(({
        state,
        icon: Icon,
        sub
      }) => {
        const active = reg?.state === state;
        const primary = state === "Join";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onPick(state, sub), className: `p-3 rounded-xl text-left transition-all border-2 ${active ? primary ? "border-turquoise bg-turquoise text-white" : "border-turquoise bg-turquoise/10" : primary ? "border-turquoise bg-turquoise/5" : "border-border bg-white"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: active && primary ? "text-white" : "text-forest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[13px] font-semibold mt-1 ${active && primary ? "text-white" : "text-forest"}`, children: state })
        ] }, state);
      }) }),
      joined && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrivalCompanion, { eventId: event.id }),
      event.teamBased && joined && /* @__PURE__ */ jsxRuntimeExports.jsx(TeamPlacement, {})
    ] }),
    confirm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-forest/40 flex items-end sm:items-center justify-center", onClick: () => setConfirm(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-[440px] p-6 m-0 sm:m-4 animate-in slide-in-from-bottom", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1 bg-forest/15 rounded-full mx-auto mb-4 sm:hidden" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-success/15 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 22, className: "text-success" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[18px] font-bold", children: confirm.state }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151] mt-1", children: confirm.sub }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirm(null), className: "mt-5 w-full bg-turquoise text-white font-semibold py-3.5 rounded-xl", children: "Got it" })
    ] }) })
  ] });
}
function Info({
  icon,
  label,
  value,
  verified
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl bg-canvas", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-forest/60 text-[10px] uppercase tracking-wider font-semibold", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[14px] font-semibold text-forest mt-1 leading-tight flex items-center gap-1", children: [
      value,
      verified && /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 13, className: "text-turquoise" })
    ] })
  ] });
}
function Tag({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] px-2 py-1 rounded-md bg-canvas text-forest font-medium", children });
}
function ArrivalCompanion({
  eventId
}) {
  const event = events.find((e) => e.id === eventId);
  const {
    checkIn,
    registrations
  } = useApp();
  const reg = registrations.find((r) => r.eventId === eventId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft mt-6 p-5 border-2 border-turquoise/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { size: 16, className: "text-turquoise" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "Arrival Companion" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[18px] font-bold", children: "First 10 minutes, made easy" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Exact location", value: event.locationName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Coordinates", value: event.coords }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Bring", value: event.whatToBring.join(", ") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Host", value: "Look for Sam with a green BuurtMatch badge" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label mt-5 mb-2", children: "First 10 minutes" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-2", children: ["Find the turquoise welcome flag", "Meet the host — no introductions needed", "Warm-up starts casually", "Teams are assigned automatically"].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5 text-[13px] text-[#374151]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-full bg-turquoise/15 text-turquoise text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5", children: i + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => checkIn(eventId), disabled: reg?.checkedIn, className: "py-3.5 rounded-xl bg-turquoise text-white font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2", children: reg?.checkedIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }),
        " Checked in"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { size: 16 }),
        " I'm here"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "py-3.5 rounded-xl bg-white border-2 border-turquoise/30 text-forest font-semibold inline-flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { size: 16 }),
        " Scan QR"
      ] })
    ] })
  ] });
}
function Row({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] text-forest/60 uppercase tracking-wider font-semibold", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] text-forest font-medium text-right", children: value })
  ] });
}
function TeamPlacement() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft mt-4 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "Team Placement Preview" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[17px] font-bold mt-1", children: "Anonymized teams" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-forest/60 mt-1", children: "Lightly balanced by skill. First-timers spread across teams." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: [{
      label: "Team A",
      you: true,
      others: 2
    }, {
      label: "Team B",
      you: false,
      others: 3
    }, {
      label: "Team C",
      you: false,
      others: 3
    }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 rounded-xl bg-canvas", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-forest", children: t.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] text-forest/70", children: t.you ? "You + 2 others" : `${t.others} participants` })
    ] }, t.label)) })
  ] });
}
export {
  EventDetail as component
};

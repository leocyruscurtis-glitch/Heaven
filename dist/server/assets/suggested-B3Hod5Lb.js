import { r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { a as useNavigate, u as useApp, L as Link } from "./router-qGr_Hydj.js";
import { M as MobileShell, C as Calendar } from "./MobileShell-UfNoLGH9.js";
import { l as listMySuggestions, r as respondToInvitation } from "./matchingClient-CWsaZS2D.js";
import { A as ArrowLeft } from "./arrow-left-CQYCycJO.js";
import { S as Sparkles } from "./sparkles-Be9Zhoed.js";
import { M as MapPin } from "./map-pin-CjSQ6_AJ.js";
import { U as Users } from "./users-PcxgCcOz.js";
import { C as Check } from "./check-DJZ37po8.js";
import { X } from "./x-C62wRerd.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
function Suggested() {
  const nav = useNavigate();
  const {
    session
  } = useApp();
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [err, setErr] = reactExports.useState(null);
  const load = () => listMySuggestions().then(setItems).catch((e) => setErr(e.message)).finally(() => setLoading(false));
  reactExports.useEffect(() => {
    if (!session) {
      nav({
        to: "/login"
      });
      return;
    }
    load();
  }, [session, nav]);
  const respond = async (item, status) => {
    if (!item.my_participant_id) return;
    setItems((prev) => prev.map((i) => i.id === item.id ? {
      ...i,
      my_status: status
    } : i));
    try {
      await respondToInvitation(item.my_participant_id, status);
    } catch (e) {
      setErr(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-forest p-2 -ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "For you" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] font-bold leading-tight", children: "Suggested events" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-[#374151] mb-4", children: "Meet people through things you already enjoy. No pressure — accept or decline." }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-boundary mb-2", children: err }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-forest/60", children: "Loading…" }),
    !loading && items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 24, className: "text-turquoise mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-semibold mt-2", children: "Nothing suggested yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] text-forest/60 mt-1", children: [
        "Add a few interests and a city in ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interests", className: "text-turquoise font-semibold", children: "My Interests" }),
        ". Suggestions appear when a few people nearby share a strong interest with you."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft p-4 border-l-4 border-turquoise", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14, className: "text-turquoise" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "Small group suggestion" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[17px] font-bold leading-tight", children: i.title }),
      i.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-[#374151] mt-1.5 leading-relaxed", children: i.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-[12px] text-forest/70", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12 }),
          " ",
          i.city
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12 }),
          " Up to ",
          i.max_participants
        ] }),
        i.suggested_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2 inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
          " ",
          new Date(i.suggested_date).toLocaleDateString(void 0, {
            weekday: "short",
            month: "short",
            day: "numeric"
          })
        ] })
      ] }),
      i.match_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-[12px] text-forest/80 italic", children: [
        '"',
        i.match_reason,
        '"'
      ] }),
      i.invitation_text && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[13px] text-forest font-medium", children: i.invitation_text }),
      i.my_status === "invited" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => respond(i, "accepted"), className: "py-2.5 rounded-lg bg-turquoise text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
          " Accept"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => respond(i, "declined"), className: "py-2.5 rounded-lg bg-white border border-border text-forest text-[13px] font-semibold inline-flex items-center justify-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }),
          " Decline"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-4 text-[13px] font-semibold ${i.my_status === "accepted" ? "text-success" : "text-forest/50"}`, children: i.my_status === "accepted" ? "✓ You're in — see you there." : "Declined. No worries." })
    ] }, i.id)) })
  ] }) });
}
export {
  Suggested as component
};

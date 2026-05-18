import { r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { s as subscribe, T as TABLES, w as write, r as read, n as nowIso, d as uid, o as organiserService, a as useNavigate, u as useApp, b as authService, L as Link, z as zones } from "./router-qGr_Hydj.js";
import { M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import { A as ArrowLeft } from "./arrow-left-CQYCycJO.js";
import { S as ShieldCheck } from "./shield-check-DFAFFWRq.js";
import { S as Sparkles } from "./sparkles-Be9Zhoed.js";
import { C as Check } from "./check-DJZ37po8.js";
import { X } from "./x-C62wRerd.js";
import { P as Plus } from "./plus-Cw3R4QLn.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
const eventService = {
  list(filter) {
    let rows = read(TABLES.events);
    if (filter?.zoneId) rows = rows.filter((e) => e.zone_id === filter.zoneId);
    if (filter?.category) rows = rows.filter((e) => e.category === filter.category);
    return rows;
  },
  byId(id) {
    return read(TABLES.events).find((e) => e.id === id) ?? null;
  },
  byOrganiser(organiserId) {
    return read(TABLES.events).filter((e) => e.organiser_id === organiserId);
  },
  async create(organiserId, organiserName, input) {
    const row = {
      organiser_id: organiserId,
      organiser_name: organiserName,
      organiser_verified: true,
      title: input.title,
      category: input.category,
      subcategory: input.subcategory ?? input.category,
      icon: input.icon ?? "📍",
      description: input.description ?? "",
      zone_id: input.zone_id,
      location_name: input.location_name ?? "TBA",
      lat: input.lat,
      lng: input.lng,
      start_time: input.start_time ?? "Today",
      start_in_min: input.start_in_min ?? 120,
      status: "scheduled",
      is_live: false,
      min_capacity: input.min_capacity ?? 4,
      max_capacity: input.max_capacity ?? 12,
      current_registration: 0,
      beginner_friendly: input.beginner_friendly ?? true,
      skill_level: input.skill_level ?? "Any",
      age_range_min: input.age_range_min ?? 18,
      age_range_max: input.age_range_max ?? 99,
      gender_requirement_optional: input.gender_requirement_optional ?? null,
      gender_requirement_reason: input.gender_requirement_reason ?? null,
      accessibility_info: input.accessibility_info ?? "Step-free entry",
      equipment_needed: input.equipment_needed ?? [],
      people_usually_come_alone: input.people_usually_come_alone ?? true,
      welcome_host_present: input.welcome_host_present ?? true,
      welcome_host_description: input.welcome_host_description ?? null,
      verified_organiser_required: true,
      team_based: input.team_based ?? false,
      team_size: input.team_size ?? null,
      spectators_allowed: input.spectators_allowed ?? true,
      bring_friend_allowed: input.bring_friend_allowed ?? true,
      recommendation_reason: input.recommendation_reason ?? `Recommended because you selected ${input.category.toLowerCase()}.`,
      distance_km: input.distance_km ?? 1
    };
    {
      const event = {
        id: uid("event"),
        ...row,
        created_at: nowIso(),
        updated_at: nowIso()
      };
      write(TABLES.events, [...read(TABLES.events), event]);
      return event;
    }
  },
  async update(id, partial) {
    {
      const rows = read(TABLES.events);
      const idx = rows.findIndex((r) => r.id === id);
      if (idx < 0) return null;
      rows[idx] = { ...rows[idx], ...partial, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
      write(TABLES.events, rows);
      return rows[idx];
    }
  },
  async remove(id) {
    {
      write(
        TABLES.events,
        read(TABLES.events).filter((e) => e.id !== id)
      );
      return;
    }
  },
  async refresh() {
    return;
  },
  onChange(cb) {
    return subscribe(TABLES.events, cb);
  }
};
const aiProposalService = {
  list() {
    return read(TABLES.aiProposals);
  },
  async approve(id, organiserId) {
    const p = read(TABLES.aiProposals).find((x) => x.id === id);
    if (!p) return;
    const org = organiserService.getById(organiserId);
    await eventService.create(organiserId, org?.name ?? "Verified organiser", {
      title: `${p.detected_theme} — community pickup`,
      category: p.detected_theme,
      subcategory: p.detected_theme,
      icon: "✨",
      description: p.proposal_reason,
      zone_id: p.zone_id,
      location_name: p.suggested_location_name,
      lat: p.suggested_lat,
      lng: p.suggested_lng,
      start_time: p.suggested_start_time,
      start_in_min: 120,
      min_capacity: 4,
      max_capacity: 12,
      beginner_friendly: true,
      recommendation_reason: p.proposal_reason
    });
    {
      write(
        TABLES.aiProposals,
        read(TABLES.aiProposals).map(
          (proposal) => proposal.id === id ? { ...proposal, status: "published", organiser_id: organiserId } : proposal
        )
      );
      return;
    }
  },
  async reject(id) {
    {
      write(
        TABLES.aiProposals,
        read(TABLES.aiProposals).map(
          (proposal) => proposal.id === id ? { ...proposal, status: "rejected" } : proposal
        )
      );
      return;
    }
  },
  onChange(cb) {
    return subscribe(TABLES.aiProposals, cb);
  }
};
function useTable(table) {
  return reactExports.useSyncExternalStore((cb) => subscribe(table, cb) ?? (() => {
  }), () => read(table), () => read(table));
}
function Organiser() {
  const nav = useNavigate();
  const {
    session,
    organiser,
    prefs,
    setPrefs
  } = useApp();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(null);
  const allEvents = useTable(TABLES.events);
  const proposals = useTable(TABLES.aiProposals);
  if (!session) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { showNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-[#374151]", children: "Please sign in as an organiser to continue." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
        await authService.signIn("demo@rotterdam.nl", "demo");
        nav({
          to: "/organiser"
        });
      }, className: "mt-4 w-full bg-turquoise text-white px-5 py-3 rounded-xl font-semibold", children: "Continue as organiser demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => nav({
        to: "/login"
      }), className: "mt-4 bg-turquoise text-white px-5 py-3 rounded-xl font-semibold", children: "Sign in" })
    ] }) });
  }
  if (session.role !== "organiser" || !organiser) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[20px] font-bold", children: "Organiser hub" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-[#374151] mt-2", children: "This area is for verified organisers." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
        await authService.signIn("demo@rotterdam.nl", "demo");
        nav({
          to: "/organiser"
        });
      }, className: "mt-5 w-full rounded-xl bg-turquoise px-5 py-3 text-[14px] font-semibold text-white", children: "Continue as organiser demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => nav({
        to: "/login"
      }), className: "mt-3 w-full rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-forest", children: "Choose another account" })
    ] }) });
  }
  const myEvents = allEvents.filter((e) => e.organiser_id === organiser.id);
  const onApprove = async (p) => {
    if (!organiser) return;
    setBusy(p.id);
    try {
      await aiProposalService.approve(p.id, organiser.id);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };
  const onReject = async (p) => {
    setBusy(p.id);
    try {
      await aiProposalService.reject(p.id);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "text-forest p-2 -ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "Verified organiser" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] font-bold leading-tight", children: organiser.name })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] px-2.5 py-1.5 rounded-md bg-turquoise/15 text-forest font-semibold inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 12 }),
        " Verified"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label mb-2", children: "AI Event Proposals" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      proposals.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft p-4 text-[13px] text-forest/60", children: "No proposals right now." }),
      proposals.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft p-4 border-l-4 border-turquoise", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14, className: "text-turquoise" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "micro-label", children: [
            "AI detected demand · ",
            p.zone_id
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[16px] font-bold leading-tight", children: p.detected_theme }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-[#374151] mt-1.5 leading-relaxed", children: p.proposal_reason }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] text-forest font-semibold mt-2", children: [
          "Suggested: ",
          p.suggested_location_name,
          " · ",
          p.suggested_start_time
        ] }),
        p.status === "proposed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: busy === p.id, onClick: () => onApprove(p), className: "py-2.5 rounded-lg bg-turquoise text-white text-[13px] font-semibold inline-flex items-center justify-center gap-1 disabled:opacity-60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
            " ",
            busy === p.id ? "Publishing…" : "Approve & publish"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: busy === p.id, onClick: () => onReject(p), className: "py-2.5 rounded-lg bg-white border border-border text-forest text-[13px] font-semibold inline-flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }),
            " Reject"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-3 text-[12px] font-semibold ${p.status === "rejected" ? "text-boundary" : "text-success"}`, children: p.status === "rejected" ? "Rejected" : "Approved — event published" })
      ] }, p.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-7 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "micro-label", children: [
        "My events (",
        myEvents.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowCreate(true), className: "text-[12px] text-turquoise font-semibold inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
        " New"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      myEvents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft p-4 text-[13px] text-forest/60", children: 'No events yet. Tap "New" to create one.' }),
      myEvents.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/event/$id", params: {
        id: e.id
      }, className: "card-soft p-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl w-10 h-10 rounded-xl bg-canvas flex items-center justify-center", children: e.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-semibold text-forest leading-tight truncate", children: e.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-forest/60 mt-0.5", children: [
            e.start_time,
            " · ",
            e.current_registration,
            "/",
            e.max_capacity,
            " · ",
            e.status
          ] })
        ] })
      ] }, e.id))
    ] }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateEventSheet, { organiserId: organiser.id, organiserName: organiser.name, defaultZone: organiser.municipality_zone_id ?? "kralingen", onClose: () => setShowCreate(false) })
  ] }) });
}
function CreateEventSheet({
  organiserId,
  organiserName,
  defaultZone,
  onClose
}) {
  const [title, setTitle] = reactExports.useState("Beginner 3v3 Street Run");
  const [category, setCategory] = reactExports.useState("Sports");
  const [subcategory, setSubcategory] = reactExports.useState("Basketball");
  const [zoneId, setZoneId] = reactExports.useState(defaultZone);
  const [locationName, setLocationName] = reactExports.useState("Kralingen Court");
  const [startTime, setStartTime] = reactExports.useState("18:30");
  const [endTime, setEndTime] = reactExports.useState("20:00");
  const [minCapacity, setMinCapacity] = reactExports.useState(6);
  const [maxCapacity, setMaxCapacity] = reactExports.useState(12);
  const [accessibility, setAccessibility] = reactExports.useState("Wheelchair accessible");
  const [beginnerFriendly, setBeginnerFriendly] = reactExports.useState(true);
  const [comeAlone, setComeAlone] = reactExports.useState(true);
  const [welcomeHost, setWelcomeHost] = reactExports.useState(true);
  const [teamBased, setTeamBased] = reactExports.useState(false);
  const [spectators, setSpectators] = reactExports.useState(true);
  const [bringFriend, setBringFriend] = reactExports.useState(true);
  const [busy, setBusy] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      const z = zones.find((x) => x.id === zoneId) ?? zones[0];
      await eventService.create(organiserId, organiserName, {
        title,
        category,
        subcategory,
        zone_id: z.id,
        location_name: locationName,
        lat: z.center[0],
        lng: z.center[1],
        start_time: `Today ${startTime}`,
        end_time: endTime,
        min_capacity: Number(minCapacity),
        max_capacity: Number(maxCapacity),
        accessibility_info: accessibility,
        beginner_friendly: beginnerFriendly,
        people_usually_come_alone: comeAlone,
        welcome_host_present: welcomeHost,
        team_based: teamBased,
        spectators_allowed: spectators,
        bring_friend_allowed: bringFriend,
        icon: category === "Sports" ? "🏀" : category === "Cooking" ? "🍳" : category === "Board Games" ? "🎲" : "📚"
      });
      onClose();
    } catch (e) {
      setErr(e.message ?? "Failed to publish");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-forest/40 flex items-end justify-center", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-t-3xl w-full max-w-[440px] p-6 max-h-[90vh] overflow-auto", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1 bg-forest/15 rounded-full mx-auto mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[20px] font-bold", children: "Create event" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-forest/60 mt-1", children: "Only eligible residents will see your event." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Sports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Board Games" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Cooking" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Literature" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Subcategory", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: subcategory, onChange: (e) => setSubcategory(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Zone", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: zoneId, onChange: (e) => setZoneId(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]", children: zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: z.id, children: z.name }, z.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Location", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: locationName, onChange: (e) => setLocationName(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "time", value: startTime, onChange: (e) => setStartTime(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "End", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "time", value: endTime, onChange: (e) => setEndTime(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Min capacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: minCapacity, onChange: (e) => setMinCapacity(Number(e.target.value)), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Max capacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: maxCapacity, onChange: (e) => setMaxCapacity(Number(e.target.value)), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Accessibility", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: accessibility, onChange: (e) => setAccessibility(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Beginner-friendly", v: beginnerFriendly, onChange: setBeginnerFriendly }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "People usually come alone", v: comeAlone, onChange: setComeAlone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Welcome host present", v: welcomeHost, onChange: setWelcomeHost }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Team-based", v: teamBased, onChange: setTeamBased }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Spectators allowed", v: spectators, onChange: setSpectators }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Bring-a-friend allowed", v: bringFriend, onChange: setBringFriend })
      ] })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-boundary mt-3", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: submit, className: "mt-5 w-full bg-turquoise text-white font-semibold py-3.5 rounded-xl disabled:opacity-60", children: busy ? "Publishing…" : "Publish event" })
  ] }) });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label mb-1.5", children: label }),
    children
  ] });
}
function Toggle({
  label,
  v,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between text-[13px] text-forest font-medium", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: v, onChange: (e) => onChange(e.target.checked), className: "accent-[var(--turquoise)] w-5 h-5" })
  ] });
}
export {
  Organiser as component
};

import { r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { u as useApp, a as useNavigate, z as zones } from "./router-qGr_Hydj.js";
import { c as createLucideIcon, M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import { u as useLegacyEvents } from "./use-events-DgS0mPMR.js";
import { M as MapPin } from "./map-pin-CjSQ6_AJ.js";
import { S as Search } from "./search-DgrFK_jR.js";
import { X } from "./x-C62wRerd.js";
import { S as ShieldCheck } from "./shield-check-DFAFFWRq.js";
import { U as Users } from "./users-PcxgCcOz.js";
import { E as Eye } from "./eye-BTtw4WmP.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
function parseCoords(coords) {
  const [lat, lng] = coords.split(",").map((s) => parseFloat(s.trim()));
  return { lat, lng };
}
function markerIcon(isLive) {
  const opacity = isLive ? 1 : 0.5;
  const slash = isLive ? "" : `<line x1="14" y1="40" x2="40" y2="14" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='54' height='54' viewBox='0 0 54 54'>
    <circle cx='27' cy='27' r='22' fill='white' stroke='#00D2C4' stroke-width='3.5' opacity='${opacity}'/>
    ${slash}
  </svg>`;
  const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  return {
    url,
    scaledSize: new google.maps.Size(44, 44),
    anchor: new google.maps.Point(22, 22),
    labelOrigin: new google.maps.Point(22, 22)
  };
}
function GoogleEventMap({
  events,
  zone,
  radiusKm,
  viewMode,
  onPinClick,
  selectedId
}) {
  const containerRef = reactExports.useRef(null);
  const mapRef = reactExports.useRef(null);
  const markersRef = reactExports.useRef([]);
  const circleRef = reactExports.useRef(null);
  const heatRef = reactExports.useRef(null);
  const [ready, setReady] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(
    "Local demo map fallback."
  );
  reactExports.useEffect(() => {
    return;
  }, []);
  reactExports.useEffect(() => {
    if (!ready || !mapRef.current) return;
    const [lat, lng] = zone.center;
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, [ready, zone.id, zone.center]);
  reactExports.useEffect(() => {
    if (!ready || !mapRef.current) return;
    const [lat, lng] = zone.center;
    if (circleRef.current) circleRef.current.setMap(null);
    circleRef.current = new google.maps.Circle({
      map: mapRef.current,
      center: { lat, lng },
      radius: radiusKm * 1e3,
      strokeColor: "#EF4444",
      strokeOpacity: 0.7,
      strokeWeight: 1.5,
      fillColor: "#EF4444",
      fillOpacity: 0.06,
      clickable: false
    });
  }, [ready, zone.id, zone.center, radiusKm]);
  const pinData = reactExports.useMemo(
    () => events.map((e) => ({ ...parseCoords(e.coords), e })),
    [events]
  );
  reactExports.useEffect(() => {
    if (!ready || !mapRef.current) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (viewMode === "heat") return;
    pinData.forEach(({ lat, lng, e }) => {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        title: e.title,
        icon: markerIcon(e.isLive),
        label: { text: e.icon, fontSize: "18px" },
        zIndex: selectedId === e.id ? 999 : 1,
        animation: selectedId === e.id ? google.maps.Animation.BOUNCE : void 0
      });
      marker.addListener("click", () => onPinClick(e.id));
      markersRef.current.push(marker);
    });
  }, [ready, pinData, viewMode, onPinClick, selectedId]);
  reactExports.useEffect(() => {
    if (!ready || !mapRef.current) return;
    if (heatRef.current) {
      heatRef.current.setMap(null);
      heatRef.current = null;
    }
    if (viewMode === "pins") return;
    const data = pinData.map(({ lat, lng }) => new google.maps.LatLng(lat, lng));
    heatRef.current = new google.maps.visualization.HeatmapLayer({
      data,
      radius: 50,
      opacity: 0.55,
      map: mapRef.current,
      gradient: [
        "rgba(0, 210, 196, 0)",
        "rgba(0, 210, 196, 0.4)",
        "rgba(11, 79, 55, 0.55)",
        "rgba(11, 79, 55, 0.75)"
      ]
    });
  }, [ready, pinData, viewMode]);
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FallbackEventMap,
      {
        events,
        zone,
        viewMode,
        selectedId,
        onPinClick
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: containerRef, className: "w-full h-full" });
}
function FallbackEventMap({
  events,
  zone,
  viewMode,
  selectedId,
  onPinClick
}) {
  const [lat, lng] = zone.center;
  const positionFor = (event) => {
    const { lat: eventLat, lng: eventLng } = parseCoords(event.coords);
    const x = Math.max(12, Math.min(88, 50 + (eventLng - lng) * 8e3));
    const y = Math.max(12, Math.min(88, 50 - (eventLat - lat) * 10500));
    return { left: `${x}%`, top: `${y}%` };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-full overflow-hidden bg-[#dff4ea]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(RotterdamDemoBasemap, { zone }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_52%_38%,rgba(255,255,255,0.22),transparent_26%),linear-gradient(180deg,rgba(244,251,247,0.18),rgba(244,251,247,0.08))]" }),
    viewMode !== "pins" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none", children: events.map((event) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-turquoise/25 blur-md",
        style: { ...positionFor(event), width: 96, height: 96 }
      },
      `${event.id}-heat`
    )) }),
    viewMode !== "heat" && events.map((event) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onPinClick(event.id),
        className: `absolute -translate-x-1/2 -translate-y-full flex h-12 w-12 items-center justify-center rounded-full rounded-bl-md border-[3px] border-white bg-turquoise text-xl shadow-lg rotate-45 transition-transform hover:scale-110 ${selectedId === event.id ? "scale-125 z-20" : "z-10"}`,
        style: positionFor(event),
        "aria-label": event.title,
        title: event.title,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "-rotate-45", children: event.icon })
      },
      event.id
    ))
  ] });
}
function RotterdamDemoBasemap({ zone }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "0 0 100 100",
        preserveAspectRatio: "none",
        className: "h-full w-full",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: "softShadow", x: "-20%", y: "-20%", width: "140%", height: "140%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "1", stdDeviation: "1.2", floodColor: "#0b4f37", floodOpacity: "0.12" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("pattern", { id: "smallRoads", width: "13", height: "13", patternUnits: "userSpaceOnUse", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 13 0 L 0 13", stroke: "#eff8f3", strokeWidth: "0.8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M -3 3 L 3 -3 M 10 16 L 16 10", stroke: "#eff8f3", strokeWidth: "0.8" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "100", height: "100", fill: "#dff4ea" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "100", height: "100", fill: "url(#smallRoads)", opacity: "0.7" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M -8 58 C 8 51 17 55 29 57 C 43 60 48 50 62 49 C 75 48 82 58 108 47 L 108 63 C 84 74 70 64 59 63 C 47 62 41 70 27 67 C 15 65 4 63 -8 69 Z",
              fill: "#b7dff2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M -5 56 C 9 50 18 53 30 55 C 44 58 48 48 62 47 C 76 46 83 56 105 46",
              fill: "none",
              stroke: "#e6f8ff",
              strokeWidth: "1.8"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 67 13 C 84 15 93 28 90 43 C 86 57 72 57 62 47 C 52 37 54 18 67 13 Z", fill: "#bdebd5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 10 16 C 26 9 41 17 40 32 C 38 47 17 47 9 37 C 2 28 2 20 10 16 Z", fill: "#c8f1df" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 9 72 C 23 65 39 72 38 88 C 22 96 9 91 5 82 C 3 77 5 74 9 72 Z", fill: "#c8f1df" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 5 48 C 24 42 40 40 58 36 C 74 33 86 27 99 21", fill: "none", stroke: "#ffffff", strokeWidth: "3.2", filter: "url(#softShadow)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 3 32 C 23 36 45 39 64 44 C 78 48 89 51 101 55", fill: "none", stroke: "#ffffff", strokeWidth: "2.5", filter: "url(#softShadow)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 45 -2 C 43 15 45 29 50 44 C 54 58 56 75 54 102", fill: "none", stroke: "#ffffff", strokeWidth: "2.4", filter: "url(#softShadow)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 78 0 C 72 17 69 31 69 45 C 69 59 75 77 82 101", fill: "none", stroke: "#ffffff", strokeWidth: "2", filter: "url(#softShadow)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 17 0 C 23 14 28 31 31 49 C 34 66 33 82 28 100", fill: "none", stroke: "#ffffff", strokeWidth: "2", filter: "url(#softShadow)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 6 60 C 21 58 35 59 48 63 C 64 68 81 71 99 70", fill: "none", stroke: "#f8d8cf", strokeWidth: "1.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 12 24 C 26 25 39 23 53 20 C 66 18 77 18 90 22", fill: "none", stroke: "#f8d8cf", strokeWidth: "1.2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M 11 85 C 28 78 43 77 60 81 C 73 84 85 83 98 78", fill: "none", stroke: "#f8d8cf", strokeWidth: "1.2" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MapLabel, { label: "Kralingse Plas", className: "right-[12%] top-[19%]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MapLabel, { label: "Crooswijk", className: "right-[27%] top-[33%]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MapLabel, { label: "Centrum", className: "left-[22%] top-[45%]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MapLabel, { label: "Maas", className: "left-[43%] top-[58%]", muted: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MapLabel, { label: "Kralingen", className: "right-[21%] top-[52%]", active: zone.id === "kralingen" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MapLabel, { label: "Delfshaven", className: "left-[10%] top-[62%]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MapLabel, { label: "Zuid", className: "right-[25%] bottom-[18%]" })
  ] });
}
function MapLabel({
  label,
  className,
  active,
  muted
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `absolute rounded-md px-2 py-1 text-[10px] font-semibold shadow-sm ${active ? "bg-white text-forest" : muted ? "bg-white/50 text-forest/40" : "bg-white/70 text-forest/55"} ${className}`,
      children: label
    }
  );
}
const AUTOCOMPLETE_ZONES = ["Rotterdam Centrum", "Kralingen", "Delfshaven", "Crooswijk", "Rotterdam Noord", "Rotterdam Zuid"];
function MapHome() {
  const {
    prefs
  } = useApp();
  const nav = useNavigate();
  const [locOpen, setLocOpen] = reactExports.useState(false);
  const [hobbyQ, setHobbyQ] = reactExports.useState("");
  const [selectedPin, setSelectedPin] = reactExports.useState(null);
  const [viewMode, setViewMode] = reactExports.useState("both");
  const events = useLegacyEvents();
  const {
    session
  } = useApp();
  reactExports.useEffect(() => {
    if (!session) nav({
      to: "/login"
    });
    else if (session.role === "resident" && !prefs.onboarded) nav({
      to: "/onboarding"
    });
    else if (session.role === "municipality_admin") nav({
      to: "/municipality"
    });
  }, [session, prefs.onboarded, nav]);
  const zone = zones.find((z) => z.id === prefs.zoneId) ?? zones[0];
  const zoneEvents = reactExports.useMemo(() => events.filter((e) => e.zoneId === prefs.zoneId), [events, prefs.zoneId]);
  const selectedEvent = zoneEvents.find((e) => e.id === selectedPin);
  const submitHobby = (q) => {
    if (!q.trim()) return;
    nav({
      to: "/search",
      search: {
        q: q.trim()
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pb-[88px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleEventMap, { events: zoneEvents, zone, radiusKm: prefs.radiusKm, viewMode, selectedId: selectedPin, onPinClick: setSelectedPin }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 left-0 right-0 p-4 pt-5 flex items-center gap-2 z-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft flex-1 px-3.5 py-2.5 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16, className: "text-turquoise" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-forest/50 leading-none uppercase tracking-wider font-semibold", children: "Your zone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-forest font-semibold leading-tight mt-0.5", children: zone.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] px-2 py-1 rounded-md bg-boundary/10 text-boundary font-semibold", children: [
          prefs.radiusKm,
          "km"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLocOpen(true), className: "card-soft w-11 h-11 flex items-center justify-center bg-white", "aria-label": "Change location", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18, className: "text-forest" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[78px] right-4 z-20 card-soft bg-white p-1 flex gap-1", children: ["pins", "both", "heat"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewMode(m), className: `text-[11px] px-2.5 py-1.5 rounded-lg font-semibold capitalize ${viewMode === m ? "bg-turquoise text-white" : "text-forest/70"}`, children: m }, m)) }),
    !selectedEvent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[104px] left-4 right-4 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HobbySearch, { value: hobbyQ, onChange: setHobbyQ, onSubmit: submitHobby }) }),
    selectedEvent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[100px] left-3 right-3 z-30 animate-in fade-in slide-in-from-bottom-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EventDetailCard, { event: selectedEvent, onClose: () => setSelectedPin(null), onJoin: () => nav({
      to: "/event/$id",
      params: {
        id: selectedEvent.id
      }
    }) }) }),
    locOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(LocationOverlay, { onClose: () => setLocOpen(false) })
  ] }) });
}
function EventDetailCard({
  event,
  onClose,
  onJoin
}) {
  const [lat, lng] = event.coords.split(",").map((s) => parseFloat(s.trim()));
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const openSpots = event.maxCapacity - event.currentRegistration;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl w-11 h-11 rounded-xl bg-canvas flex items-center justify-center shrink-0", children: event.icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[17px] font-semibold leading-tight", children: event.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-forest/40 -mt-1 -mr-1 p-1", "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[13px] text-[#374151] mt-1", children: [
        event.startTime,
        " · ",
        event.locationName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] text-forest/60 mt-0.5", children: [
        event.organiser,
        " · ",
        openSpots,
        " open"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-2", children: [
        event.beginnerFriendly && /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { children: "Beginner-friendly" }),
        event.organiserVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 11 }), children: "Verified" }),
        event.welcomeHost && /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 11 }), children: "Welcome host" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-forest/70 mt-2.5 italic leading-snug", children: event.recommendationReason }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onJoin, className: "bg-turquoise text-white font-semibold py-2.5 rounded-xl text-[13px]", children: "Join" }),
        event.spectatorsAllowed && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onJoin, className: "bg-canvas text-forest font-semibold py-2.5 rounded-xl text-[13px] flex items-center justify-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }),
          " Just watch"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: gmapsUrl, target: "_blank", rel: "noreferrer", className: "mt-2 w-full text-center bg-white border border-border text-forest font-medium py-2.5 rounded-xl text-[13px] flex items-center justify-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 }),
        " Open in Google Maps"
      ] })
    ] })
  ] }) });
}
function Chip({
  children,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] px-2 py-1 rounded-md bg-success/10 text-forest font-medium inline-flex items-center gap-1", children: [
    icon,
    children
  ] });
}
function HobbySearch({
  value,
  onChange,
  onSubmit
}) {
  const allHobbies = ["Basketball", "Football", "Walking", "Running", "Board Games", "Quiet reading", "Cooking", "Salsa", "Karaoke", "Book club"];
  const matches = value ? allHobbies.filter((h) => h.toLowerCase().startsWith(value.toLowerCase())).slice(0, 4) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft p-2 bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "text-forest/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value, onChange: (e) => onChange(e.target.value), onKeyDown: (e) => e.key === "Enter" && onSubmit(value), placeholder: "Search a hobby (e.g. basketball)", className: "flex-1 py-2.5 text-[14px] outline-none bg-transparent placeholder:text-forest/40" })
    ] }),
    matches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border mt-1 pt-1", children: matches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      onChange("");
      onSubmit(m);
    }, className: "w-full text-left px-3 py-2.5 rounded-lg hover:bg-canvas text-[14px] text-forest", children: m }, m)) })
  ] });
}
function LocationOverlay({
  onClose
}) {
  const {
    prefs,
    setPrefs
  } = useApp();
  const [q, setQ] = reactExports.useState("");
  const all = zones.map((z) => {
    const friendly = AUTOCOMPLETE_ZONES.find((a) => z.name.toLowerCase().includes(a.toLowerCase())) ?? z.name;
    return {
      ...z,
      friendly
    };
  });
  const matches = q ? all.filter((z) => z.name.toLowerCase().includes(q.toLowerCase()) || z.friendly.toLowerCase().includes(q.toLowerCase())) : all;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-white z-40 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pt-5 flex items-center gap-3 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-forest p-2 -ml-2", "aria-label": "Back", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 bg-canvas rounded-xl px-3 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16, className: "text-forest/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, value: q, onChange: (e) => setQ(e.target.value), placeholder: "Type a neighbourhood (e.g. Kralingen)", className: "flex-1 bg-transparent outline-none text-[14px] placeholder:text-forest/40" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider text-forest/50 font-semibold", children: "Suggestions" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-3 pt-0", children: matches.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
      setPrefs({
        zoneId: z.id
      });
      onClose();
    }, className: "w-full text-left px-4 py-3 rounded-xl hover:bg-canvas flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-forest font-medium", children: z.friendly }),
      prefs.zoneId === z.id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-turquoise font-semibold", children: "CURRENT" })
    ] }, z.id)) })
  ] });
}
export {
  MapHome as component
};

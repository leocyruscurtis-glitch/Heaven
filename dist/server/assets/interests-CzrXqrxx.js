import { r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { a as useNavigate, u as useApp, L as Link } from "./router-qGr_Hydj.js";
import { c as createLucideIcon, M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import { I as INTEREST_CATEGORIES, a as listMyInterests, u as updateProfile, b as addInterest, c as updateInterest, d as removeInterest } from "./matchingClient-CWsaZS2D.js";
import { A as ArrowLeft } from "./arrow-left-CQYCycJO.js";
import { P as Plus } from "./plus-Cw3R4QLn.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
const __iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function InterestsPage() {
  const nav = useNavigate();
  const {
    session,
    user
  } = useApp();
  const [interests, setInterests] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [err, setErr] = reactExports.useState(null);
  const [fullName, setFullName] = reactExports.useState("");
  const [age, setAge] = reactExports.useState("");
  const [city, setCity] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [newName, setNewName] = reactExports.useState("");
  const [newCat, setNewCat] = reactExports.useState(INTEREST_CATEGORIES[0]);
  const [newIntensity, setNewIntensity] = reactExports.useState(4);
  const [savedNote, setSavedNote] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!session) {
      nav({
        to: "/login"
      });
      return;
    }
    if (!user) return;
    setFullName(user.full_name ?? "");
    setAge(user.age != null ? String(user.age) : "");
    setCity(user.city ?? "");
    setBio(user.short_bio ?? "");
    listMyInterests(user.id).then(setInterests).catch((e) => setErr(e.message)).finally(() => setLoading(false));
  }, [session, user, nav]);
  if (!session || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { showNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-16 text-[14px] text-[#374151]", children: "Sign in to manage your interests." }) });
  }
  const saveProfile = async () => {
    try {
      await updateProfile(user.id, {
        full_name: fullName || null,
        age: age ? Number(age) : null,
        city: city || null,
        short_bio: bio || null
      });
      setSavedNote("Saved");
      setTimeout(() => setSavedNote(null), 1500);
    } catch (e) {
      setErr(e.message);
    }
  };
  const onAdd = async () => {
    if (!newName.trim()) return;
    try {
      const row = await addInterest({
        userId: user.id,
        interest_name: newName.trim(),
        interest_category: newCat,
        intensity: newIntensity
      });
      setInterests((prev) => [row, ...prev]);
      setNewName("");
      setNewIntensity(4);
    } catch (e) {
      setErr(e.message);
    }
  };
  const onUpdate = async (id, patch) => {
    setInterests((prev) => prev.map((i) => i.id === id ? {
      ...i,
      ...patch
    } : i));
    try {
      await updateInterest(id, patch);
    } catch (e) {
      setErr(e.message);
    }
  };
  const onDelete = async (id) => {
    setInterests((prev) => prev.filter((i) => i.id !== id));
    try {
      await removeInterest(id);
    } catch (e) {
      setErr(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "text-forest p-2 -ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "Personal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] font-bold leading-tight", children: "My Interests" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-[#374151] mb-4", children: "Pick a few things you already enjoy. Rate how interested you are. You can change this later." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "card-soft p-4 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label mb-2", children: "Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Full name", value: fullName, onChange: (e) => setFullName(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Age", inputMode: "numeric", value: age, onChange: (e) => setAge(e.target.value.replace(/\D/g, "")), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "City (e.g. Rotterdam)", value: city, onChange: (e) => setCity(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Short bio (optional, kept private)", value: bio, onChange: (e) => setBio(e.target.value), rows: 2, className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px] resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: saveProfile, className: "w-full bg-turquoise text-white font-semibold py-3 rounded-xl text-[14px]", children: [
          "Save profile ",
          savedNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[12px] opacity-80", children: [
            "· ",
            savedNote
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "card-soft p-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label mb-2", children: "Add an interest" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "e.g. Basketball, Chess, Community dinners", value: newName, onChange: (e) => setNewName(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px] mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: newCat, onChange: (e) => setNewCat(e.target.value), className: "w-full bg-canvas rounded-xl px-3 py-3 outline-none text-[14px]", children: INTEREST_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IntensityPicker, { value: newIntensity, onChange: setNewIntensity })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onAdd, disabled: !newName.trim(), className: "w-full bg-turquoise text-white font-semibold py-3 rounded-xl text-[14px] inline-flex items-center justify-center gap-1 disabled:opacity-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
        " Add interest"
      ] })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-boundary mb-2", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "micro-label mb-2", children: [
      "Your interests (",
      interests.length,
      ")"
    ] }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-forest/60", children: "Loading…" }),
    !loading && interests.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft p-4 text-[13px] text-forest/60", children: "No interests yet. Add one above." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: interests.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-semibold text-forest leading-tight", children: i.interest_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: i.interest_category ?? INTEREST_CATEGORIES[0], onChange: (e) => onUpdate(i.id, {
            interest_category: e.target.value
          }), className: "mt-1 bg-canvas rounded-md px-2 py-1 text-[12px] outline-none", children: INTEREST_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDelete(i.id), className: "text-boundary p-1.5", "aria-label": "Remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IntensityPicker, { value: i.intensity, onChange: (v) => onUpdate(i.id, {
        intensity: v
      }) }) })
    ] }, i.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/suggested", className: "block text-center text-[13px] text-turquoise font-semibold", children: "See suggested events →" }) })
  ] }) });
}
function IntensityPicker({
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 bg-canvas rounded-xl px-2 py-2", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange(n), className: `flex-1 h-7 rounded-md text-[12px] font-semibold ${value >= n ? "bg-turquoise text-white" : "bg-white text-forest/50"}`, children: n }, n)) });
}
export {
  InterestsPage as component
};

import { $ as TSS_SERVER_FUNCTION, a1 as getServerFnById, a0 as createServerFn, r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { a as useNavigate, u as useApp, L as Link, f as supabase } from "./router-qGr_Hydj.js";
import { c as createLucideIcon, M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import { o as object, n as number, s as string } from "./index-9qQULOcK.js";
import { A as ArrowLeft } from "./arrow-left-CQYCycJO.js";
import { S as Sparkles } from "./sparkles-Be9Zhoed.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
];
const Play = createLucideIcon("play", __iconNode);
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const runMatching = createServerFn({
  method: "POST"
}).inputValidator((input) => object({
  accessToken: string().min(10),
  minIntensity: number().min(1).max(5).optional(),
  minGroupSize: number().min(2).max(20).optional(),
  maxGroupSize: number().min(2).max(20).optional()
}).parse(input)).handler(createSsrRpc("577fd75b88080caeb9ffe7939e431024f7655abc0df50436c00c801cb0b140ee"));
function AdminMatch() {
  const nav = useNavigate();
  const {
    session
  } = useApp();
  const [busy, setBusy] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [err, setErr] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!session) nav({
      to: "/login"
    });
    else if (session.role !== "municipality_admin") nav({
      to: "/"
    });
  }, [session, nav]);
  const run = async () => {
    setBusy(true);
    setErr(null);
    try {
      const {
        data
      } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Not signed in.");
      const res = await runMatching({
        data: {
          accessToken: token
        }
      });
      setResult(res);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };
  if (!session || session.role !== "municipality_admin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { showNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-16 text-[14px]", children: "Admins only." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/municipality", className: "text-forest p-2 -ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "Admin · Testing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] font-bold leading-tight", children: "Run matching" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-[#374151] mb-4", children: "Groups users by same city + shared strong interest (≥4) into small suggested events. AI writes the copy only." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: run, disabled: busy, className: "w-full bg-turquoise text-white font-semibold py-3.5 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 16 }),
      " ",
      busy ? "Running…" : "Run matching now"
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-boundary mt-3", children: err }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft p-3 text-[12px] text-forest/70", children: [
        "Scanned ",
        result.totalGroups,
        " (city × interest) groups · AI ",
        result.aiConfigured ? "configured" : "fallback"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "micro-label", children: [
        "Created (",
        result.created.length,
        ")"
      ] }),
      result.created.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft p-3 text-[13px] text-forest/60", children: "No new suggestions." }),
      result.created.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft p-3 border-l-4 border-turquoise", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 12, className: "text-turquoise" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "micro-label", children: [
            c.city,
            " · ",
            c.shared_interest,
            " · ",
            c.group_size,
            " users"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-semibold", children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-forest/50 mt-1", children: [
          "Status: ",
          c.status
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-forest/50 mt-1 break-all", children: [
          "Participant IDs: ",
          c.participant_ids.map((id) => id.slice(0, 8)).join(", ")
        ] })
      ] }, c.event_id)),
      result.skipped.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "micro-label mt-3", children: [
          "Skipped (",
          result.skipped.length,
          ")"
        ] }),
        result.skipped.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft p-2 text-[12px] text-forest/60", children: [
          s.city,
          " · ",
          s.shared_interest,
          " — ",
          s.reason,
          " (size ",
          s.size,
          ")"
        ] }, idx))
      ] })
    ] })
  ] }) });
}
export {
  AdminMatch as component
};

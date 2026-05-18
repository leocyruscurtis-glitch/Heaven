import { r as reactExports, T as jsxRuntimeExports } from "./server-zgXUd0Aa.js";
import { u as useApp, L as Link } from "./router-qGr_Hydj.js";
import { c as createLucideIcon, B as Building2, M as MobileShell } from "./MobileShell-UfNoLGH9.js";
import { A as ArrowLeft } from "./arrow-left-CQYCycJO.js";
import { S as ShieldCheck } from "./shield-check-DFAFFWRq.js";
import { C as Check } from "./check-DJZ37po8.js";
import { C as ChevronRight } from "./chevron-right-ffvthshb.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-9qQULOcK.js";
const __iconNode$6 = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
];
const Banknote = createLucideIcon("banknote", __iconNode$6);
const __iconNode$5 = [
  [
    "path",
    {
      d: "M10.5 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v6",
      key: "g5mvt7"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "m14 20 2 2 4-4", key: "15kota" }]
];
const FileCheckCorner = createLucideIcon("file-check-corner", __iconNode$5);
const __iconNode$4 = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M16 10h2", key: "8sgtl7" }],
  ["path", { d: "M16 14h2", key: "epxaof" }],
  ["path", { d: "M6.17 15a3 3 0 0 1 5.66 0", key: "n6f512" }],
  ["circle", { cx: "9", cy: "11", r: "2", key: "yxgjnd" }],
  ["rect", { x: "2", y: "5", width: "20", height: "14", rx: "2", key: "qneu4z" }]
];
const IdCard = createLucideIcon("id-card", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M10 18v-7", key: "wt116b" }],
  [
    "path",
    {
      d: "M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z",
      key: "1m329m"
    }
  ],
  ["path", { d: "M14 18v-7", key: "vav6t3" }],
  ["path", { d: "M18 18v-7", key: "aexdmj" }],
  ["path", { d: "M3 22h18", key: "8prr45" }],
  ["path", { d: "M6 18v-7", key: "1ivflk" }]
];
const Landmark = createLucideIcon("landmark", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);
const STEPS = [{
  id: "email",
  title: "Email",
  sub: "Magic link or OTP",
  icon: Mail,
  tier: 1
}, {
  id: "phone",
  title: "NL phone",
  sub: "SMS OTP",
  icon: Phone,
  tier: 1
}, {
  id: "id",
  title: "ID verification",
  sub: "Passport, ID card or Residence Permit",
  icon: IdCard,
  tier: 1
}, {
  id: "vog",
  title: "VOG",
  sub: "Verklaring Omtrent het Gedrag (Justis)",
  icon: FileCheckCorner,
  tier: 2
}, {
  id: "kvk",
  title: "KvK extract",
  sub: "Recent (< 3 months)",
  icon: Building2,
  tier: 3
}, {
  id: "ubo",
  title: "UBO declaration",
  sub: "NGOs, foundations, companies",
  icon: FileText,
  tier: 3
}, {
  id: "muni",
  title: "Municipality token",
  sub: "Gemeente validation code",
  icon: Landmark,
  tier: 3
}, {
  id: "iban",
  title: "NL IBAN",
  sub: "€0.01 iDEAL simulation",
  icon: Banknote,
  tier: 4
}, {
  id: "btw",
  title: "BTW-id",
  sub: "Where applicable",
  icon: FileText,
  tier: 4
}];
function Verify() {
  const {
    prefs,
    setPrefs
  } = useApp();
  const [done, setDone] = reactExports.useState({});
  const completed = STEPS.filter((s) => done[s.id]).length;
  const allDone = completed === STEPS.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "text-forest p-2 -ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "micro-label", children: "Organiser portal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[22px] font-bold leading-tight", children: "Get Verified" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-soft p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-semibold text-forest", children: "Verification status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-forest/60 mt-1", children: prefs.organiserVerified ? "Verified organiser" : allDone ? "Awaiting municipality review" : completed > 0 ? "In progress" : "Not started" })
        ] }),
        prefs.organiserVerified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] px-2.5 py-1.5 rounded-md bg-turquoise/15 text-forest font-semibold inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 12 }),
          " Verified"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] px-2.5 py-1.5 rounded-md bg-canvas text-forest font-semibold", children: [
          completed,
          "/",
          STEPS.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-canvas rounded-full overflow-hidden mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-turquoise transition-all", style: {
        width: `${completed / STEPS.length * 100}%`
      } }) })
    ] }),
    [1, 2, 3, 4].map((tier) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "micro-label mb-2", children: [
        "Tier ",
        tier,
        " — ",
        ["", "Identity", "Background", "Organisation", "Financial"][tier]
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft divide-y divide-border", children: STEPS.filter((s) => s.tier === tier).map((s) => {
        const Icon = s.icon;
        const isDone = !!done[s.id];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setDone({
          ...done,
          [s.id]: !isDone
        }), className: "w-full flex items-center gap-3 p-4 text-left active:bg-canvas", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${isDone ? "bg-success/15 text-success" : "bg-canvas text-forest/60"}`, children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-semibold text-forest leading-tight", children: s.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-forest/60 mt-0.5", children: s.sub })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-forest/30" })
        ] }, s.id);
      }) })
    ] }, tier)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-soft mt-6 p-4 bg-success/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-forest leading-relaxed", children: "Real KYC, VOG, iDIN, KvK, IBAN, iDEAL and BTW checks are simulated in this prototype. They represent future backend integrations." }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !allDone || prefs.organiserVerified, onClick: () => setPrefs({
        organiserVerified: true
      }), className: "py-3.5 rounded-xl bg-turquoise text-white font-semibold disabled:opacity-40", children: "Submit for review" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/organiser", className: "py-3.5 rounded-xl bg-white border-2 border-turquoise/30 text-forest font-semibold text-center", children: "Go to organiser" })
    ] }),
    !prefs.organiserVerified && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPrefs({
      organiserVerified: true
    }), className: "mt-3 w-full text-[12px] text-forest/50 underline", children: "Skip — simulate verified state (demo)" })
  ] }) });
}
export {
  Verify as component
};

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = join(here, "..", "public", "env.js");

const publicEnv = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
  VITE_SUPABASE_PUBLISHABLE_KEY:
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  VITE_SUPABASE_PROJECT_ID: process.env.VITE_SUPABASE_PROJECT_ID || "",
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `window.CIVIC_ROUTES_ENV = ${JSON.stringify(publicEnv, null, 2)};\n`,
);

console.log("Wrote public/env.js");

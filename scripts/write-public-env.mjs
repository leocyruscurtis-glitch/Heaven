import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outputPath = join(here, "..", "public", "env.js");

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isSupabaseUrl(value) {
  return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(clean(value));
}

function isPublishableKey(value) {
  const candidate = clean(value);
  return (
    (candidate.startsWith("eyJ") && candidate.includes(".")) ||
    candidate.startsWith("sb_publishable_")
  );
}

function isProjectId(value) {
  return /^[a-z0-9-]+$/.test(clean(value));
}

function firstValid(candidates, validator) {
  return candidates.map(clean).find((value) => validator(value)) || "";
}

function projectIdFromUrl(url) {
  return clean(url).match(/^https:\/\/([a-z0-9-]+)\.supabase\.co\/?$/)?.[1] || "";
}

const supabaseUrl = firstValid(
  [
    process.env.VITE_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
  ],
  isSupabaseUrl,
);

const publishableKey = firstValid(
  [
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
  ],
  isPublishableKey,
);

const projectId =
  firstValid(
    [process.env.VITE_SUPABASE_PROJECT_ID, process.env.SUPABASE_PROJECT_ID],
    isProjectId,
  ) || projectIdFromUrl(supabaseUrl);

const publicEnv = {
  VITE_SUPABASE_URL: supabaseUrl,
  VITE_SUPABASE_PUBLISHABLE_KEY: publishableKey,
  VITE_SUPABASE_PROJECT_ID: projectId,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `window.CIVIC_ROUTES_ENV = ${JSON.stringify(publicEnv, null, 2)};\n`,
);

console.log("Wrote public/env.js");

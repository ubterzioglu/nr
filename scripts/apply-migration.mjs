// Supabase Management API üzerinden SQL migrasyonu uygular.
// Kullanım: node scripts/apply-migration.mjs supabase/migrations/001_platform_foundation.sql
// Gerekli: .env.local içinde SUPABASE_ACCESS_TOKEN ve NEXT_PUBLIC_SUPABASE_URL
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readEnvLocal() {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim();
  }
  return env;
}

const sqlPath = process.argv[2];
if (!sqlPath) {
  console.error("Kullanım: node scripts/apply-migration.mjs <sql-dosyası>");
  process.exit(1);
}

const env = readEnvLocal();
const token = env.SUPABASE_ACCESS_TOKEN;
const url = env.NEXT_PUBLIC_SUPABASE_URL;
if (!token || !url) {
  console.error(".env.local içinde SUPABASE_ACCESS_TOKEN ve NEXT_PUBLIC_SUPABASE_URL gerekli.");
  process.exit(1);
}

const projectRef = new URL(url).hostname.split(".")[0];
const sql = readFileSync(resolve(process.cwd(), sqlPath), "utf8");

const response = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  }
);

const body = await response.text();
if (!response.ok) {
  console.error(`HATA ${response.status}: ${body}`);
  process.exit(1);
}
console.log(`OK ${response.status}: ${sqlPath} uygulandı.`);
if (body && body !== "[]") console.log(body);

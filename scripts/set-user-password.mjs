// Supabase Auth Admin API ile kullanıcı şifresi günceller.
// Kullanım: node scripts/set-user-password.mjs <email> <yeni-şifre>
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

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Kullanım: node scripts/set-user-password.mjs <email> <yeni-şifre>");
  process.exit(1);
}

const env = readEnvLocal();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(".env.local içinde NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.");
  process.exit(1);
}

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};

// E-postadan kullanıcı id'si bul (GoTrue admin listesi, e-posta filtresi)
const listResponse = await fetch(
  `${url}/auth/v1/admin/users?page=1&per_page=100`,
  { headers }
);
const listBody = await listResponse.json();
if (!listResponse.ok) {
  console.error(`HATA ${listResponse.status}: ${JSON.stringify(listBody)}`);
  process.exit(1);
}
const users = Array.isArray(listBody.users) ? listBody.users : listBody;
const user = users.find(
  (candidate) => candidate.email?.toLowerCase() === email.toLowerCase()
);
if (!user) {
  console.error(`Kullanıcı bulunamadı: ${email}`);
  process.exit(1);
}

const response = await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
  method: "PUT",
  headers,
  body: JSON.stringify({ password }),
});
const body = await response.json().catch(() => ({}));
if (!response.ok) {
  console.error(`HATA ${response.status}: ${JSON.stringify(body)}`);
  process.exit(1);
}

console.log(`OK: ${email} şifresi güncellendi.`);

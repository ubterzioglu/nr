// Supabase Auth Admin API ile doğrulanmış kullanıcı oluşturur.
// Kullanım: node scripts/create-admin-user.mjs <email> "<Ad Soyad>"
// Gerekli: .env.local içinde NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY
// Çıktı: geçici şifre (ilk girişten sonra değiştirilmeli).
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomBytes } from "node:crypto";

function readEnvLocal() {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim();
  }
  return env;
}

const email = process.argv[2];
const fullName = process.argv[3] ?? "";
if (!email) {
  console.error('Kullanım: node scripts/create-admin-user.mjs <email> "<Ad Soyad>"');
  process.exit(1);
}

const env = readEnvLocal();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(".env.local içinde NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.");
  process.exit(1);
}

const password = `Nexrise-${randomBytes(6).toString("base64url")}`;

const response = await fetch(`${url}/auth/v1/admin/users`, {
  method: "POST",
  headers: {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
    email_confirm: true,
    user_metadata: fullName ? { full_name: fullName } : {},
  }),
});

const body = await response.json().catch(() => ({}));
if (!response.ok) {
  console.error(`HATA ${response.status}: ${JSON.stringify(body)}`);
  process.exit(1);
}

console.log(`OK: kullanıcı oluşturuldu (id: ${body.id})`);
console.log(`E-posta: ${email}`);
console.log(`Geçici şifre: ${password}`);
console.log("Not: İlk girişten sonra 'Şifremi unuttum' veya profilden şifre değiştirilmeli.");

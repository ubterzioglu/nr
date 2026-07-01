# NEXRISE Web Platformu

NEXRISE; teknoloji, girişimcilik, yapay zekâ, inovasyon ve kariyer alanlarında faaliyet gösteren bağımsız bir topluluk ve ekosistemdir.

**Slogan:** *Rise of the Next Generation*

> Teknik referans: [`MASTER.md`](./MASTER.md)

## Teknolojiler

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Shadcn UI
- Framer Motion
- Lucide Icons
- Supabase (hazır altyapı)
- React Hook Form + Zod
- Vercel deploy ready

## Kurulum

```bash
git clone <repo-url>
cd kurumsal-site
npm install
cp .env.example .env.local
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Ortam Değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyalayın:

| Değişken | Açıklama |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side işlemler |
| `NEXT_PUBLIC_SITE_URL` | Site URL (production) |

## Sayfa Yapısı

| Route | Açıklama |
|---|---|
| `/` | Ana Sayfa |
| `/hakkimizda` | Hakkımızda |
| `/yonetim` | Yönetim Kadrosu |
| `/baskanliklar` | Başkanlıklar |
| `/topluluklar` | Topluluk Grupları |
| `/etkinlikler` | Etkinlikler |
| `/webinarlar` | Webinarlar |
| `/blog` | Blog |
| `/sponsorlar` | Sponsorlar |
| `/basvurular` | Başvurular |
| `/iletisim` | İletişim |
| `/admin` | Admin Panel (iskelet) |

## Supabase

Veritabanı şeması: [`supabase/schema.sql`](./supabase/schema.sql)

Tablolar: `users`, `roles`, `events`, `webinars`, `blogs`, `applications`, `departments`, `board_members`, `sponsors`, `contacts`, `settings`

## Deploy (Vercel)

```bash
npm run build
```

Vercel'e bağlayın, ortam değişkenlerini ekleyin ve deploy edin.

## Proje Yapısı

```
src/
├── app/              # Next.js App Router sayfaları
├── components/       # UI, layout, home, forms
├── config/           # site.ts — merkezi içerik
├── lib/              # utils, validations, supabase
└── types/            # TypeScript tipleri
```

## Lisans

© NEXRISE Yönetim Kurulu. Tüm hakları saklıdır.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # Dev server at http://localhost:3000
npm run build   # Production build (also the pre-deploy check)
npm run lint    # ESLint (flat config, eslint 9)
```

There is no test framework configured. Next.js 16 is in use — APIs may differ from training data; check `node_modules/next/dist/docs/` when unsure (see AGENTS.md).

## What this is

Corporate/community website for NEXRISE (Turkish tech & entrepreneurship community). **MASTER.md is the product spec and single source of truth** — pages, colors, social links, and admin modules must follow it. All user-facing content is Turkish; site copy must stay consistent with the "NEXRISE Kurumsal Yönetim ve Organizasyon El Kitabı" (captured in `src/config/handbook.ts`) — do not invent content.

Stack: Next.js 16 App Router · TypeScript · Tailwind CSS v4 · shadcn-style UI (`src/components/ui/`) · Framer Motion · React Hook Form + Zod · Supabase · Nodemailer.

## Architecture

**Content-as-config.** Pages contain almost no hardcoded copy. Nearly all content lives in `src/config/`:
- `site.ts` — brand, colors, navigation arrays, team, events, webinars, sponsors, FAQ, social links
- `content.ts` — corporate texts (about, mission/vision) derived from the handbook
- `handbook.ts` — organization handbook data (presidencies, rules, org structure)

To change site content, edit these configs, not the page components.

**Routes are Turkish slugs** (`/hakkimizda`, `/etkinlikler`, `/basvurular`…). English equivalents permanently redirect to them in `next.config.ts` — add redirects there if renaming routes.

**Form pipeline** (contact, applications, sponsor inquiry, event registration):
1. Client form (`src/components/forms/*`) with React Hook Form + Zod schema from `src/lib/validations/forms.ts`
2. Server action in `src/lib/actions/forms.ts` (`"use server"`) re-validates with `safeParse`
3. Email notification via `src/lib/email/send-notification.ts` (Nodemailer/SMTP) — **email is the primary channel; if SMTP is unconfigured the action fails with a user-facing error**
4. Supabase insert is secondary and optional — skipped silently when Supabase env vars are absent

**Supabase is optional at runtime.** `createBrowserClient()`/`createServerClient()` in `src/lib/supabase/client.ts` return `null` when env vars are missing, and callers must handle that (site works fully without a database). Schema: `supabase/schema.sql`; generated-style types: `src/types/database.ts`.

**Admin panel** (`/admin`, skeleton stage): auth is a single shared password compared against `ADMIN_SECRET`, stored as an httpOnly cookie (`src/lib/admin/session.ts`). The gate lives in `src/app/admin/(panel)/layout.tsx`, not middleware. With `ADMIN_SECRET` unset, development mode counts as authenticated.

**SEO:** every page builds metadata through `pageMetadata()` in `src/lib/seo.ts`; `sitemap.ts` and `robots.ts` live in `src/app/`.

## Environment variables

No `.env.example` exists yet (README references one). Used variables:

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Email: `SMTP_USER`, `SMTP_PASS` (required for forms), `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM`, `FORM_NOTIFICATION_EMAIL`
- Site: `NEXT_PUBLIC_SITE_URL`, `ADMIN_SECRET`

## Design constraints (from MASTER.md)

- Brand colors are fixed: primary `#1D6FFF`, secondary `#2AA7FF`, dark `#050B1A`, accent `#5CC8FF` (defined in `brand.colors` in `src/config/site.ts`)
- The official logo must not be redesigned; UI derives from it
- Design language: modern, premium, minimal (Apple/Stripe/Vercel/Linear feel); mobile-first, responsive, dark mode supported

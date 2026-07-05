# Feedback (Geri Bildirim) Sistemi — Tasarım

**Tarih:** 2026-07-05
**Durum:** Onaylandı, uygulama planına geçiliyor

## Amaç

Site ziyaretçilerinin/üyelerinin NEXRISE platformu hakkında yorum, öneri ve
hata bildirimi bırakabileceği, giriş zorunlu bir feedback akışı. Toplanan
geri bildirimler admin panelinde ayrı bir bölümde değerlendirilecek ve
durumları (açık/incelemede/çözüldü/reddedildi) yönetim tarafından
güncellenecek. Aynı zamanda `/mvpubt` içeriği kök route'a (`/`) taşınacak,
coming-soon kaldırılacak, nav'a "Feedback Ver" öğesi ve BETA rozeti eklenecek.

## Mevcut Desenle İlişki

Bu özellik, mevcut `revizyon-istekleri` (revision requests) özelliğiyle
mimari olarak neredeyse birebir aynıdır: auth zorunlu, başlık/açıklama,
herkese açık liste + detay + yorum akışı, admin tarafında durum yönetimi.
Fark: feedback'e tek görsel eki eklenebilir, ve ayrı bir tablo/route seti
kullanır (revizyon isteklerinden bağımsız bir kayıt defteri).

Uygulama, `revision_requests` / `revision_comments` / `src/lib/actions/revisions.ts`
/ `src/lib/actions/admin/revisions.ts` / `src/app/revizyon-istekleri/*` /
`src/app/admin/(panel)/revisions/page.tsx` dosyalarını referans alıp aynı
kalıpları izleyecek.

## Veritabanı

Yeni migrasyon: `supabase/migrations/005_feedback.sql` (veya proje migrasyon
numaralandırma sırasına göre bir sonraki numara).

```sql
create table feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  author_name text not null,
  title text not null,
  description text not null,
  image_url text,
  status text not null default 'open', -- open | reviewing | resolved | rejected
  created_at timestamptz not null default now()
);

create table feedback_comments (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references feedback(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  author_name text not null,
  is_admin boolean not null default false,
  body text not null,
  created_at timestamptz not null default now()
);

create index feedback_comments_feedback_id_idx on feedback_comments(feedback_id);
```

**RLS (`supabase/policies.sql`):** `revision_requests`/`revision_comments`
politikalarıyla aynı model — `select` herkese (anon dahil) açık, `insert`
yalnızca service-role (server action) üzerinden yapılır (RLS `insert`
politikası yok / kapalı, tıpkı revizyon isteklerinde olduğu gibi).

**Storage:** yeni public bucket `feedback-attachments`.
- Herkese `select` (okuma) açık — görseller public URL ile servis edilir.
- `insert` yalnızca server action üzerinden (service-role key), client'tan
  doğrudan yükleme yok. Dosya tipi (`image/png`, `image/jpeg`, `image/webp`)
  ve boyut (max 5MB) server action içinde Zod/manuel kontrolle doğrulanır.

`src/types/database.ts`: `feedback`, `feedback_comments` tabloları ve
`FeedbackStatus` tipi eklenir (mevcut `RegistrationStatus` gibi bir union
type).

## Route'lar

- `src/app/geri-bildirim/page.tsx` — Liste sayfası.
  - `getCurrentUser()` yoksa `redirect("/giris")` (revizyon-istekleri
    deseniyle birebir aynı).
  - Yeni feedback formu (başlık, açıklama, opsiyonel görsel).
  - Tüm feedback'lerin listesi: durum rozeti, yazar adı, tarih, yorum sayısı.
  - `robots: { index: false, follow: false }` (revizyon-istekleri gibi, auth
    arkasında olduğu için indekslenmez).

- `src/app/geri-bildirim/[id]/page.tsx` — Detay + yorum akışı.
  - Feedback detayı (başlık, açıklama, görsel varsa gösterilir), yorum
    listesi, yorum ekleme formu (giriş yapan üye veya admin).

- `src/app/admin/(panel)/feedback/page.tsx` — Admin liste sayfası.
  - `DataTable` ile liste, durum değiştirme aksiyonları (İncelemede /
    Çözüldü / Reddet / Yeniden Aç), detay/yorum linki, silme.
  - `admin/(panel)/layout.tsx`'teki `adminLinks` dizisine eklenir:
    `{ href: "/admin/feedback", label: "Kullanıcı Geri Bildirimleri" }`.

## Server Actions

`src/lib/actions/feedback.ts` (kullanıcı tarafı, `revisions.ts` deseni):

```ts
createFeedback(input: { title: string; description: string; imageUrl?: string }): ActionResult
// getCurrentUser() zorunlu, Zod doğrulama, feedback tablosuna insert.

addFeedbackComment(input: { feedbackId: string; body: string }): ActionResult
// getCurrentUser() veya getAdminSession() zorunlu; addRevisionComment ile
// aynı yazar-adı çözümleme mantığı (admin ise "Yönetim" rozetiyle).

uploadFeedbackImage(formData: FormData): { success: true; url: string } | { success: false; error: string }
// Dosya tipi + boyut (5MB) server-side doğrulanır, feedback-attachments
// bucket'ına yüklenir, public URL döner. Form önce bu action'ı çağırıp
// URL'i alır, sonra createFeedback'e geçirir.
```

`src/lib/actions/admin/feedback.ts` (`admin/revisions.ts` deseni):

```ts
setFeedbackStatus(id: string, status: FeedbackStatus): ActionResult
deleteFeedback(id: string): ActionResult
```

`src/lib/feedback-status.ts`: `revision-status.ts` ile aynı yapıda
label/variant map (open/reviewing/resolved/rejected).

`src/lib/validations/forms.ts`: yeni `feedbackSchema` eklenir (title min 5,
description min 10; görsel dosyası ayrıca client tarafında tip+boyut
kontrolünden geçer, şemaya dahil edilmez çünkü `File` sunucu tarafına
FormData ile ayrı gider).

## Form Bileşeni

`src/components/forms/feedback-form.tsx` — React Hook Form + Zod,
`revision-forms.tsx`'teki `NewRevisionRequestForm` yapısına görsel yükleme
alanı eklenmiş hali: native file input, seçili görsel için küçük önizleme,
yükleme sırasında buton disabled + spinner durumu, 5MB/tip hatası anlık
client tarafında gösterilir.

## Nav ve Ana Sayfa Değişiklikleri

- `src/config/site.ts`: `primaryNavigation` dizisine
  `{ label: "Feedback Ver", href: "/geri-bildirim" }` eklenir (üst nav'da
  görünür, `mobileNavigation`'a da eklenir).
- **BETA rozeti:** `Navbar` içinde logo yanına küçük bir "BETA" pill rozeti
  eklenir (code-freeze banner'ı gibi tam genişlik bir şerit değil — o
  "dokunma" uyarısı taşıyor, bu ise "erken sürüm" bilgilendirmesi; görsel
  karışıklığı önlemek için ayrı ve daha sade bir bileşen).
- **Ana sayfa taşıma:**
  - `src/app/mvpubt/page.tsx` içeriği `src/app/page.tsx`'e taşınır (route
    kodu, veri çekme mantığı, bileşen importları aynen aktarılır —
    `src/components/mvpubt/*` bileşenleri değişmeden kullanılmaya devam
    eder, sadece artık kök route'tan render edilir).
  - `src/app/mvpubt/` klasörü silinir.
  - `src/components/coming-soon/` klasörü tamamen silinir.
  - `src/app/page.tsx`'teki eski `ComingSoon` importu ve ilgili font importu
    kaldırılır.
  - `sitemap.ts` içindeki `/mvpubt` girdisi kaldırılır/kök ile birleştirilir;
    `robots: { index: false }` ayarı yeni köke taşınmaz (ana sayfa
    indekslenebilir olmalı — eski coming-soon sayfasının indeksleme ayarı
    esas alınır).
  - `/mvp` **code freeze kapsamında değiştirilmez** — kendi başına ayrı bir
    route olarak kalmaya devam eder, bu taşıma işleminden etkilenmez.
  - Kod içinde `/mvpubt`'ye sabit link veren yerler (varsa) `/` olarak
    güncellenir.

## Kapsam Dışı

- Feedback gönderimi için e-posta bildirimi yok (revizyon isteklerinde de
  yok — sadece DB, admin panelden takip edilir).
- Görsel dışında dosya tipi yok, çoklu dosya yok.
- Gönderen kullanıcı kendi feedback'ini düzenleyemez/silemez — durum
  yönetimi yalnızca admin'de (revizyon deseniyle aynı).

## Test/Doğrulama Planı

- `npm run build` ile tip ve derleme kontrolü.
- Manuel akış: giriş yapmadan `/geri-bildirim`'e gidince `/giris`'e
  yönlendiğini doğrula.
- Giriş yapıp görsel ekleyerek feedback oluşturma, admin panelden durumu
  değiştirme, yorum ekleme uçtan uca denenir.
- `/` kök route'un artık `/mvpubt` içeriğini rendered ettiği, `/mvp`'nin
  değişmediği doğrulanır.

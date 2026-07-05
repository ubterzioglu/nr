# Feedback (Geri Bildirim) Sistemi Implementasyon Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auth zorunlu, görsel ekli bir feedback (geri bildirim) akışı eklemek; `/mvpubt` içeriğini kök route'a (`/`) taşımak; coming-soon'u kaldırmak; navbar'a "Feedback Ver" linki ve BETA rozeti eklemek.

**Architecture:** Mevcut `revizyon-istekleri` özelliğiyle birebir aynı mimari (auth-gated liste+detay+yorum, service-role yazma, RLS'siz okuma-serbest tablo). Görsel yükleme, mevcut `uploadImage()` yardımcı fonksiyonu (`src/lib/actions/admin/shared.ts`) genişletilerek yapılır — server action `FormData` alır, `saveEvent` deseniyle aynı şekilde dosyayı işler.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase (Postgres + Storage + Auth), Zod, React Hook Form kullanılmıyor bu akışta (mevcut `revision-forms.tsx` deseni gibi düz `useState` + `FormData`).

## Global Constraints

- Türkçe route slug'ları kullanılır (`/geri-bildirim`), İngilizce eşdeğeri yok çünkü bu sayfa herkese açık indekslenen bir sayfa değil.
- `/mvp` ve `src/components/home/` **code freeze** kapsamında — bu plan onlara asla dokunmaz.
- Marka renkleri `src/config/site.ts` `brand.colors` içinden kullanılır, hardcode edilmez.
- Tüm kullanıcıya görünen metinler Türkçe.
- Yazma işlemleri her zaman service-role client (`createServerClient()`) üzerinden; RLS okuma tarafında zaten `revision_requests` gibi politika yoksa `public_read_*` policy eklenmez (mevcut deseni bozmayın — feedback tabloları da RLS enable ama policy'siz kalır, okuma server component'lerde service-role client ile yapılır).
- `npm run build` her görevden sonra hatasız geçmeli (bu proje test framework'süz, `build` ana doğrulama aracı).

---

## Task 1: Veritabanı migrasyonu — `feedback` ve `feedback_comments` tabloları

**Files:**
- Create: `supabase/migrations/005_feedback.sql`
- Modify: `src/types/database.ts` (feedback, feedback_comments tabloları + `FeedbackStatus` tipi eklenir)

**Interfaces:**
- Produces: `Database["public"]["Tables"]["feedback"]["Row"]`, `Database["public"]["Tables"]["feedback_comments"]["Row"]`, `FeedbackStatus = "open" | "reviewing" | "resolved" | "rejected"` — sonraki tüm task'lar bu tipleri kullanır.

- [ ] **Step 1: Migrasyon dosyasını yaz**

`supabase/migrations/003_revisions_management.sql` ile birebir aynı desen:

```sql
-- =============================================================
-- 005_feedback.sql — Kullanıcı geri bildirim sistemi (auth
-- zorunlu, opsiyonel görsel eki). İdempotent.
-- =============================================================

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'reviewing', 'resolved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feedback_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_comments_feedback
  ON feedback_comments (feedback_id, created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_created
  ON feedback (created_at DESC);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_comments ENABLE ROW LEVEL SECURITY;
-- policy yok → okuma/yazma server action'lardaki service role üzerinden
-- (üye girişi action içinde doğrulanır, revision_requests ile aynı desen).
```

- [ ] **Step 2: Migrasyonu Supabase'e uygula**

Proje kökünde `.env.local` içindeki `SUPABASE_ACCESS_TOKEN` ve proje ref'i kullanılarak, CLAUDE.md'de belirtildiği gibi SQL dosyası Supabase Management API'ye POST edilir. Uygulama scriptleri için mevcut migrasyon uygulama scriptine bakın (`scripts/` klasöründe benzer bir script varsa onu kullanın; yoksa `supabase db push` yerine proje halihazırda "SQL dosyasını Management API'ye POST etme" yöntemini kullanıyor — `003_revisions_management.sql`'in nasıl uygulandığını referans alın).

Doğrulama: Supabase dashboard'da `feedback` ve `feedback_comments` tablolarının göründüğünü kontrol edin.

- [ ] **Step 3: `src/types/database.ts`'e tip tanımlarını ekle**

Dosyanın en üstündeki tip union'larının yanına ekle (satır ~14, `EmailStatus` altına):

```ts
export type FeedbackStatus = "open" | "reviewing" | "resolved" | "rejected";
```

`Tables` objesine, `revision_requests`/`revision_comments` tanımlarının hemen sonrasına (varsa) veya `meetings` tablosundan sonra (satır ~818, `};` kapanışından önce) ekle:

```ts
      feedback: {
        Row: {
          id: string;
          user_id: string | null;
          author_name: string;
          title: string;
          description: string;
          image_url: string | null;
          status: FeedbackStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          author_name: string;
          title: string;
          description: string;
          image_url?: string | null;
          status?: FeedbackStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          author_name?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          status?: FeedbackStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      feedback_comments: {
        Row: {
          id: string;
          feedback_id: string;
          user_id: string | null;
          author_name: string;
          is_admin: boolean;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          feedback_id: string;
          user_id?: string | null;
          author_name: string;
          is_admin?: boolean;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          feedback_id?: string;
          user_id?: string | null;
          author_name?: string;
          is_admin?: boolean;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
```

- [ ] **Step 4: Derlemeyi doğrula**

Run: `npm run build`
Expected: Hatasız geçer (bu noktada yeni tipler henüz kullanılmıyor, sadece tanımlı).

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/005_feedback.sql src/types/database.ts
git commit -m "feat(db): feedback ve feedback_comments tabloları"
```

---

## Task 2: Supabase Storage bucket — `feedback-attachments`

**Files:**
- Modify: `src/lib/actions/admin/shared.ts:84-85` (bucket union tipine `"feedback-attachments"` eklenir)

**Interfaces:**
- Consumes: `uploadImage(supabase, bucket, keyPrefix, file)` mevcut imzası (Task 1'den bağımsız, mevcut kod).
- Produces: `uploadImage(supabase, "feedback-attachments", keyPrefix, file)` çağrısı artık tip hatası vermeden çalışır. Task 3 bunu kullanır.

- [ ] **Step 1: Supabase dashboard'da bucket oluştur**

Supabase projesinde Storage → New bucket:
- Name: `feedback-attachments`
- Public: evet (public read, `event-images`/`avatars` bucket'larıyla aynı yapılandırma — bu proje public bucket + service-role-only-write modelini kullanıyor, RLS storage policy eklemeye gerek yok çünkü tüm yazma zaten servis rolüyle yapılıyor).

- [ ] **Step 2: `shared.ts`'teki bucket union tipini genişlet**

`src/lib/actions/admin/shared.ts:84`:

```ts
export async function uploadImage(
  supabase: SupabaseClient<Database>,
  bucket: "event-images" | "avatars" | "feedback-attachments",
  keyPrefix: string,
  file: File
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
```

- [ ] **Step 3: Derlemeyi doğrula**

Run: `npm run build`
Expected: Hatasız geçer.

- [ ] **Step 4: Commit**

```bash
git add src/lib/actions/admin/shared.ts
git commit -m "feat(storage): feedback-attachments bucket desteği"
```

---

## Task 3: Kullanıcı tarafı server action'lar — `src/lib/actions/feedback.ts`

**Files:**
- Create: `src/lib/actions/feedback.ts`
- Modify: `src/lib/validations/forms.ts` (yeni `feedbackSchema` eklenir)

**Interfaces:**
- Consumes: `getCurrentUser()` (`src/lib/supabase/server.ts`), `createServerClient()` (`src/lib/supabase/client.ts`), `uploadImage()` (Task 2), `getAdminSession()` (`src/lib/admin/session.ts`).
- Produces: `createFeedback(formData: FormData): Promise<ActionResult>`, `addFeedbackComment(input: { feedbackId: string; body: string }): Promise<ActionResult>` — Task 5 ve 6'daki form bileşenleri bunları çağırır. `ActionResult = { success: true } | { success: false; error: string }`.

- [ ] **Step 1: `feedbackSchema`'yı `forms.ts`'e ekle**

`src/lib/validations/forms.ts` sonuna ekle:

```ts
export const feedbackSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;
```

- [ ] **Step 2: `src/lib/actions/feedback.ts` dosyasını oluştur**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { getAdminSession } from "@/lib/admin/session";
import { uploadImage } from "@/lib/actions/admin/shared";
import { feedbackSchema } from "@/lib/validations/forms";

type ActionResult = { success: true } | { success: false; error: string };

const commentSchema = z.object({
  feedbackId: z.string().uuid(),
  body: z.string().min(2, "Yorum en az 2 karakter olmalıdır"),
});

/** Üye yeni feedback açar (giriş zorunlu); opsiyonel görsel eki yükler. */
export async function createFeedback(formData: FormData): Promise<ActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Geri bildirim göndermek için giriş yapmalısınız." };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "Veritabanı yapılandırılmamış." };
  }

  const parsed = feedbackSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }

  let imageUrl: string | undefined;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    const upload = await uploadImage(
      supabase,
      "feedback-attachments",
      `feedback/${currentUser.authUser.id}`,
      imageFile
    );
    if (!upload.ok) return { success: false, error: upload.error };
    imageUrl = upload.url;
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: currentUser.authUser.id,
    author_name:
      currentUser.profile?.full_name ?? currentUser.authUser.email ?? "Üye",
    title: parsed.data.title,
    description: parsed.data.description,
    image_url: imageUrl ?? null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/geri-bildirim");
  revalidatePath("/admin/feedback");
  return { success: true };
}

/** Feedback altına yorum — üye veya admin (admin yorumu rozetli görünür). */
export async function addFeedbackComment(input: {
  feedbackId: string;
  body: string;
}): Promise<ActionResult> {
  const [currentUser, adminSession] = await Promise.all([
    getCurrentUser(),
    getAdminSession(),
  ]);
  if (!currentUser && !adminSession) {
    return { success: false, error: "Yorum yapmak için giriş yapmalısınız." };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "Veritabanı yapılandırılmamış." };
  }

  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz yorum." };
  }

  const isAdmin = Boolean(adminSession);
  const authorName = isAdmin
    ? adminSession?.kind === "supabase"
      ? (adminSession.fullName ?? "NEXRISE Yönetim")
      : "NEXRISE Yönetim"
    : (currentUser?.profile?.full_name ?? currentUser?.authUser.email ?? "Üye");

  const { error } = await supabase.from("feedback_comments").insert({
    feedback_id: parsed.data.feedbackId,
    user_id: currentUser?.authUser.id ?? null,
    author_name: authorName,
    is_admin: isAdmin,
    body: parsed.data.body,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/geri-bildirim/${parsed.data.feedbackId}`);
  revalidatePath("/admin/feedback");
  return { success: true };
}
```

- [ ] **Step 3: Derlemeyi doğrula**

Run: `npm run build`
Expected: Hatasız geçer.

- [ ] **Step 4: Commit**

```bash
git add src/lib/actions/feedback.ts src/lib/validations/forms.ts
git commit -m "feat(feedback): kullanıcı server action'ları (oluştur, yorum ekle)"
```

---

## Task 4: Admin server action'lar — `src/lib/actions/admin/feedback.ts`

**Files:**
- Create: `src/lib/actions/admin/feedback.ts`
- Create: `src/lib/feedback-status.ts`

**Interfaces:**
- Consumes: `requireAdminContext(module?: AdminModule)` (`src/lib/actions/admin/shared.ts`), `AdminActionResult` tipi.
- Produces: `setFeedbackStatus(id: string, status: FeedbackStatus): Promise<AdminActionResult>`, `deleteFeedback(id: string): Promise<AdminActionResult>`, `feedbackStatusLabels: Record<string, { label: string; variant: "default" | "secondary" }>` — Task 7'deki admin sayfası bunları kullanır.

- [ ] **Step 1: `src/lib/feedback-status.ts` dosyasını oluştur**

```ts
export const feedbackStatusLabels: Record<
  string,
  { label: string; variant: "default" | "secondary" }
> = {
  open: { label: "Açık", variant: "default" },
  reviewing: { label: "İncelemede", variant: "secondary" },
  resolved: { label: "Çözüldü", variant: "secondary" },
  rejected: { label: "Reddedildi", variant: "secondary" },
};
```

- [ ] **Step 2: `src/lib/actions/admin/feedback.ts` dosyasını oluştur**

`src/lib/actions/admin/revisions.ts` ile birebir aynı desen, `community` modülüyle korunur:

```ts
"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";
import type { FeedbackStatus } from "@/types/database";

const VALID_STATUSES: FeedbackStatus[] = ["open", "reviewing", "resolved", "rejected"];

export async function setFeedbackStatus(
  id: string,
  status: FeedbackStatus
): Promise<AdminActionResult> {
  const guard = await requireAdminContext("community");
  if (!guard.ok) return { success: false, error: guard.error };

  if (!VALID_STATUSES.includes(status)) {
    return { success: false, error: "Geçersiz durum." };
  }

  const { error } = await guard.context.supabase
    .from("feedback")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/feedback");
  revalidatePath("/geri-bildirim");
  revalidatePath(`/geri-bildirim/${id}`);
  return { success: true };
}

export async function deleteFeedback(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext("community");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("feedback")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/feedback");
  revalidatePath("/geri-bildirim");
  return { success: true };
}
```

- [ ] **Step 3: Derlemeyi doğrula**

Run: `npm run build`
Expected: Hatasız geçer.

- [ ] **Step 4: Commit**

```bash
git add src/lib/actions/admin/feedback.ts src/lib/feedback-status.ts
git commit -m "feat(admin): feedback durum yönetimi server action'ları"
```

---

## Task 5: Form bileşenleri — `src/components/forms/feedback-forms.tsx`

**Files:**
- Create: `src/components/forms/feedback-forms.tsx`

**Interfaces:**
- Consumes: `createFeedback(formData: FormData)`, `addFeedbackComment(input)` (Task 3).
- Produces: `<NewFeedbackForm />`, `<FeedbackCommentForm feedbackId={string} />` — Task 6'daki sayfalar bunları render eder.

- [ ] **Step 1: Bileşen dosyasını oluştur**

`revision-forms.tsx` deseni + görsel input eklenmiş hali. `createFeedback` artık `FormData` aldığı için (dosya içerdiğinden `useState` ile obje toplayıp `FormData`'ya çeviriyoruz):

```tsx
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createFeedback, addFeedbackComment } from "@/lib/actions/feedback";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Yeni feedback formu (giriş zorunlu sayfada kullanılır). */
export function NewFeedbackForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setErrorMessage(null);
    if (!file) {
      setImagePreview(null);
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage("Yalnızca JPG, PNG veya WebP görsel yükleyebilirsiniz.");
      event.target.value = "";
      setImagePreview(null);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrorMessage("Görsel en fazla 5 MB olabilir.");
      event.target.value = "";
      setImagePreview(null);
      return;
    }
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await createFeedback(formData);
    if (!result.success) {
      setStatus("idle");
      setErrorMessage(result.error);
      return;
    }
    setTitle("");
    setDescription("");
    setImagePreview(null);
    formRef.current?.reset();
    setStatus("idle");
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="feedback-title" className="mb-1.5 block text-sm font-medium">
          Başlık
        </label>
        <Input
          id="feedback-title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Örn. Etkinlik kayıt formunda bir sorun var"
          required
          minLength={5}
        />
      </div>
      <div>
        <label htmlFor="feedback-description" className="mb-1.5 block text-sm font-medium">
          Açıklama
        </label>
        <Textarea
          id="feedback-description"
          name="description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Geri bildirimini kısaca anlat: ne, neden, nasıl?"
          required
          minLength={10}
        />
      </div>
      <div>
        <label htmlFor="feedback-image" className="mb-1.5 block text-sm font-medium">
          Görsel (opsiyonel, max 5 MB)
        </label>
        <input
          id="feedback-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-muted/80"
        />
        {imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview}
            alt="Yüklenecek görsel önizlemesi"
            className="mt-3 h-32 w-auto rounded-lg border border-border object-cover"
          />
        )}
      </div>
      {errorMessage && <p className="text-sm text-brand-error">{errorMessage}</p>}
      <Button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Gönderiliyor..." : "Gönder"}
      </Button>
    </form>
  );
}

/** Feedback detayında yorum formu. */
export function FeedbackCommentForm({ feedbackId }: { feedbackId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);
    const result = await addFeedbackComment({ feedbackId, body });
    if (!result.success) {
      setStatus("idle");
      setErrorMessage(result.error);
      return;
    }
    setBody("");
    setStatus("idle");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        aria-label="Yorumun"
        rows={3}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Yorumunu yaz..."
        required
        minLength={2}
      />
      {errorMessage && <p className="text-sm text-brand-error">{errorMessage}</p>}
      <Button type="submit" size="sm" disabled={status === "saving"}>
        {status === "saving" ? "Gönderiliyor..." : "Yorum Yap"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Derlemeyi doğrula**

Run: `npm run build`
Expected: Hatasız geçer.

- [ ] **Step 3: Commit**

```bash
git add src/components/forms/feedback-forms.tsx
git commit -m "feat(feedback): form bileşenleri (oluştur, yorum)"
```

---

## Task 6: Kullanıcı sayfaları — `/geri-bildirim` liste ve detay

**Files:**
- Create: `src/app/geri-bildirim/page.tsx`
- Create: `src/app/geri-bildirim/[id]/page.tsx`

**Interfaces:**
- Consumes: `getCurrentUser()`, `createServerClient()`, `<NewFeedbackForm />`, `<FeedbackCommentForm />` (Task 5), `feedbackStatusLabels` (Task 4), `pageMetadata()` (`src/lib/seo.ts`).

- [ ] **Step 1: Liste sayfasını oluştur**

`src/app/revizyon-istekleri/page.tsx` deseni, görsel eki için ek kolon:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { NewFeedbackForm } from "@/components/forms/feedback-forms";
import { feedbackStatusLabels } from "@/lib/feedback-status";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Geri Bildirim",
    description: "NEXRISE platformu için geri bildirimlerini paylaş.",
    path: "/geri-bildirim",
  }),
  robots: { index: false, follow: false },
};

export default async function FeedbackPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/giris");

  const supabase = createServerClient();
  const [{ data: items }, { data: comments }] = supabase
    ? await Promise.all([
        supabase.from("feedback").select("*").order("created_at", { ascending: false }),
        supabase.from("feedback_comments").select("feedback_id"),
      ])
    : [{ data: [] }, { data: [] }];

  const commentCounts = new Map<string, number>();
  for (const comment of comments ?? []) {
    commentCounts.set(
      comment.feedback_id,
      (commentCounts.get(comment.feedback_id) ?? 0) + 1
    );
  }

  return (
    <section className="min-h-screen bg-muted/30 pb-20 pt-28">
      <Container className="max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold">Geri Bildirim</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Site ve platformla ilgili görüş, öneri veya hata bildirimini
          paylaş; yönetim değerlendirip durumunu günceller.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Yeni Geri Bildirim Gönder</CardTitle>
          </CardHeader>
          <CardContent>
            <NewFeedbackForm />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {(items ?? []).length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Henüz geri bildirim yok. İlkini sen gönder!
            </p>
          ) : (
            (items ?? []).map((item) => {
              const status = feedbackStatusLabels[item.status] ?? feedbackStatusLabels.open;
              return (
                <Link key={item.id} href={`/geri-bildirim/${item.id}`} className="block">
                  <Card className="transition-colors hover:border-brand-primary/40">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="font-semibold">{item.title}</h2>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{item.author_name}</span>
                        <span>{new Date(item.created_at).toLocaleDateString("tr-TR")}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {commentCounts.get(item.id) ?? 0} yorum
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Detay sayfasını oluştur**

`src/app/revizyon-istekleri/[id]/page.tsx` deseni, `image_url` varsa gösterilir:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { FeedbackCommentForm } from "@/components/forms/feedback-forms";
import { feedbackStatusLabels } from "@/lib/feedback-status";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Geri Bildirim Detayı",
    description: "NEXRISE geri bildirim detayı.",
    path: "/geri-bildirim",
  }),
  robots: { index: false, follow: false },
};

export default async function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/giris");

  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const [{ data: item }, { data: comments }] = await Promise.all([
    supabase.from("feedback").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("feedback_comments")
      .select("*")
      .eq("feedback_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!item) notFound();

  const status = feedbackStatusLabels[item.status] ?? feedbackStatusLabels.open;

  return (
    <section className="min-h-screen bg-muted/30 pb-20 pt-28">
      <Container className="max-w-3xl">
        <Button asChild variant="secondary" size="sm" className="mb-6">
          <Link href="/geri-bildirim">
            <ArrowLeft className="h-4 w-4" /> Tüm Geri Bildirimler
          </Link>
        </Button>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-xl font-bold">{item.title}</h1>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {item.author_name} ·{" "}
              {new Date(item.created_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            {item.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image_url}
                alt="Geri bildirim eki"
                className="mt-4 max-h-96 w-auto rounded-lg border border-border object-contain"
              />
            )}
          </CardContent>
        </Card>

        <h2 className="mb-3 mt-8 text-lg font-semibold">
          Yorumlar ({comments?.length ?? 0})
        </h2>
        <div className="space-y-3">
          {(comments ?? []).map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{comment.author_name}</span>
                  {comment.is_admin && (
                    <Badge variant="secondary" className="gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Yönetim
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                  {comment.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <FeedbackCommentForm feedbackId={item.id} />
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Derlemeyi doğrula**

Run: `npm run build`
Expected: Hatasız geçer.

- [ ] **Step 4: Manuel test — giriş yapmadan erişim**

Dev sunucusunu başlat: `npm run dev`. Tarayıcıda giriş yapmadan `http://localhost:3000/geri-bildirim` adresine git.
Expected: `/giris` sayfasına yönlendirilir.

- [ ] **Step 5: Commit**

```bash
git add src/app/geri-bildirim
git commit -m "feat(feedback): kullanıcı liste ve detay sayfaları"
```

---

## Task 7: Admin panel sayfası — `/admin/(panel)/feedback`

**Files:**
- Create: `src/app/admin/(panel)/feedback/page.tsx`
- Modify: `src/app/admin/(panel)/layout.tsx:22` (adminLinks dizisine yeni satır eklenir)

**Interfaces:**
- Consumes: `createServerClient()`, `setFeedbackStatus`, `deleteFeedback` (Task 4), `feedbackStatusLabels` (Task 4), `DataTable`, `ConfirmButton` (mevcut admin bileşenleri).

- [ ] **Step 1: Admin sayfasını oluştur**

`src/app/admin/(panel)/revisions/page.tsx` deseni:

```tsx
import Link from "next/link";
import { Eye } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import {
  setFeedbackStatus,
  deleteFeedback,
} from "@/lib/actions/admin/feedback";
import { feedbackStatusLabels } from "@/lib/feedback-status";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database, FeedbackStatus } from "@/types/database";

type FeedbackRow = Database["public"]["Tables"]["feedback"]["Row"];

export const dynamic = "force-dynamic";

const statusActions: { status: FeedbackStatus; label: string }[] = [
  { status: "reviewing", label: "İncelemede" },
  { status: "resolved", label: "Çözüldü" },
  { status: "rejected", label: "Reddet" },
  { status: "open", label: "Yeniden Aç" },
];

const columns: DataTableColumn<FeedbackRow>[] = [
  {
    key: "title",
    label: "Geri Bildirim",
    className: "max-w-md",
    render: (row) => (
      <div>
        <p className="font-medium">{row.title}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{row.description}</p>
      </div>
    ),
  },
  { key: "author_name", label: "Gönderen" },
  {
    key: "created_at",
    label: "Tarih",
    render: (row) =>
      new Date(row.created_at).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    key: "status",
    label: "Durum",
    render: (row) => {
      const status = feedbackStatusLabels[row.status] ?? feedbackStatusLabels.open;
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
];

export default async function AdminFeedbackPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Kullanıcı Geri Bildirimleri</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için geri bildirimler görüntülenemiyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: items, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Kullanıcı Geri Bildirimleri</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-brand-error">
            Geri bildirimler yüklenemedi: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Kullanıcı Geri Bildirimleri</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Üyelerin gönderdiği geri bildirimler. Yorum yazmak için detay
        sayfasını kullanın; yorumunuz &quot;Yönetim&quot; rozetiyle görünür.
      </p>

      <DataTable
        columns={columns}
        rows={items}
        summary={`${items.length} geri bildirim`}
        emptyMessage="Henüz geri bildirim yok."
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Detay & yorumlar">
              <Link href={`/geri-bildirim/${row.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            {statusActions
              .filter((action) => action.status !== row.status)
              .slice(0, 3)
              .map((action) => (
                <ConfirmButton
                  key={action.status}
                  message={`"${row.title}" geri bildirimi "${feedbackStatusLabels[action.status].label}" olarak işaretlensin mi?`}
                  action={setFeedbackStatus.bind(null, row.id, action.status)}
                  variant="outline"
                  destructive={false}
                >
                  {action.label}
                </ConfirmButton>
              ))}
            <ConfirmButton
              message={`"${row.title}" geri bildirimi silinsin mi? Bu işlem geri alınamaz.`}
              action={deleteFeedback.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />
    </div>
  );
}
```

- [ ] **Step 2: `adminLinks`'e ekle**

`src/app/admin/(panel)/layout.tsx:22` — `revisions` satırından hemen sonra:

```ts
  { href: "/admin/revisions", label: "Revizyon İstekleri" },
  { href: "/admin/feedback", label: "Kullanıcı Geri Bildirimleri" },
```

- [ ] **Step 3: Derlemeyi doğrula**

Run: `npm run build`
Expected: Hatasız geçer.

- [ ] **Step 4: Commit**

```bash
git add "src/app/admin/(panel)/feedback" "src/app/admin/(panel)/layout.tsx"
git commit -m "feat(admin): kullanıcı geri bildirimleri paneli"
```

---

## Task 8: Navbar — "Feedback Ver" linki ve BETA rozeti

**Files:**
- Modify: `src/config/site.ts:60-91` (primaryNavigation, mobileNavigation)
- Create: `src/components/shared/beta-badge.tsx`
- Modify: `src/components/layout/navbar.tsx`

**Interfaces:**
- Produces: `<BetaBadge />` — Task 9'da `/mvpubt`→`/` taşındıktan sonra da navbar zaten burada render edildiği için ek bir değişiklik gerekmez (navbar tüm sayfalarda ortak).

- [ ] **Step 1: Nav dizilerine feedback linkini ekle**

`src/config/site.ts` — `primaryNavigation` (satır 60-66):

```ts
export const primaryNavigation: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Etkinlikler", href: "/etkinlikler" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Feedback Ver", href: "/geri-bildirim" },
];
```

`mobileNavigation` (satır 79-91) — `İletişim`'den sonra ekle:

```ts
export const mobileNavigation: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Yönetim", href: "/yonetim" },
  { label: "Başkanlıklar", href: "/baskanliklar" },
  { label: "Topluluklar", href: "/topluluklar" },
  { label: "Etkinlikler", href: "/etkinlikler" },
  { label: "Webinarlar", href: "/webinarlar" },
  { label: "Blog", href: "/blog" },
  { label: "Sponsorlar", href: "/sponsorlar" },
  { label: "Başvurular", href: "/basvurular" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Feedback Ver", href: "/geri-bildirim" },
];
```

- [ ] **Step 2: `BetaBadge` bileşenini oluştur**

```tsx
export function BetaBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded-full border border-brand-accent/40 bg-brand-accent/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-accent">
      Beta
    </span>
  );
}
```

- [ ] **Step 3: Navbar'a rozeti ekle**

`src/components/layout/navbar.tsx:8` importlara ekle:

```tsx
import { BetaBadge } from "@/components/shared/beta-badge";
```

Satır 62-64 (logo linki) içine rozeti ekle:

```tsx
            <Link href="/" className="inline-flex shrink-0 items-center">
              <Logo size="sm" />
              <BetaBadge />
            </Link>
```

- [ ] **Step 4: Derlemeyi doğrula**

Run: `npm run build`
Expected: Hatasız geçer.

- [ ] **Step 5: Manuel görsel kontrol**

`npm run dev` çalıştır, herhangi bir sayfada navbar'ı incele: BETA rozeti logonun yanında, "Feedback Ver" linki üst nav'da görünür olmalı (masaüstünde `primaryNavigation`, mobilde hamburger menüde `mobileNavigation`).

- [ ] **Step 6: Commit**

```bash
git add src/config/site.ts src/components/shared/beta-badge.tsx src/components/layout/navbar.tsx
git commit -m "feat(nav): Feedback Ver linki ve BETA rozeti"
```

---

## Task 9: `/mvpubt` içeriğini kök route'a taşı, coming-soon'u kaldır

**Files:**
- Modify: `src/app/page.tsx` (mvpubt içeriğiyle değiştirilir)
- Delete: `src/app/mvpubt/page.tsx` (ve boş kalan `src/app/mvpubt/` klasörü)
- Delete: `src/components/coming-soon/coming-soon.tsx` (ve boş kalan `src/components/coming-soon/` klasörü)
- Modify: `src/app/sitemap.ts:8` (mvpubt ayrı girdi yoktu zaten, priority/robots kontrolü)

**Interfaces:**
- Consumes: `getPublishedEvents()`, `getPublishedWebinars()`, `getHeroSettings()`, `getSocialLinkSettings()` (mevcut `src/lib/data/*`), `src/components/mvpubt/*` bileşenleri (değişmeden kullanılır).

- [ ] **Step 1: `src/app/page.tsx`'i mvpubt içeriğiyle değiştir**

Mevcut `src/app/mvpubt/page.tsx` içeriğini birebir al, `robots: { index: false, follow: false }` satırını KALDIR (ana sayfa artık indekslenebilir olmalı), path'i `/` yap:

```tsx
import type { Metadata } from "next";
import { brand, social } from "@/config/site";
import { googleSnippet, pageMetadata } from "@/lib/seo";
import { getPublishedEvents } from "@/lib/data/events";
import { getPublishedWebinars } from "@/lib/data/webinars";
import { getHeroSettings, getSocialLinkSettings } from "@/lib/data/settings";
import { Hero } from "@/components/mvpubt/hero";
import { AboutPreview } from "@/components/mvpubt/about-preview";
import { Statistics } from "@/components/mvpubt/statistics";
import { CommunitiesPreview } from "@/components/mvpubt/communities-preview";
import { UpcomingEvents } from "@/components/mvpubt/upcoming-events";
import { FeaturedWebinars } from "@/components/mvpubt/featured-webinars";
import { FAQ } from "@/components/mvpubt/faq";
import { CallToAction } from "@/components/mvpubt/cta";
import { SocialFollow } from "@/components/mvpubt/social-follow";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${brand.name} — ${brand.slogan}`,
    description: googleSnippet,
    path: "/",
  }),
};

export const revalidate = 60;

export default async function HomePage() {
  const [events, webinars, heroSettings, socialSettings] = await Promise.all([
    getPublishedEvents(),
    getPublishedWebinars(),
    getHeroSettings(),
    getSocialLinkSettings(),
  ]);

  const settingsHrefByName: Record<string, string | undefined> = {
    Instagram: socialSettings?.instagram,
    YouTube: socialSettings?.youtube,
    LinkedIn: socialSettings?.linkedin,
    "WhatsApp Kanalı": socialSettings?.whatsappChannel,
    "WhatsApp Topluluğu": socialSettings?.whatsappCommunity,
  };
  const socialLinks = social.map((link) => ({
    ...link,
    href: settingsHrefByName[link.name] || link.href,
  }));

  return (
    <>
      <Hero content={heroSettings ?? undefined} />
      <AboutPreview />
      <Statistics />
      <CommunitiesPreview />
      <UpcomingEvents events={events} />
      <FeaturedWebinars webinars={webinars} />
      <FAQ />
      <SocialFollow links={socialLinks} />
      <CallToAction />
    </>
  );
}
```

- [ ] **Step 2: Eski `mvpubt` route'unu ve coming-soon'u sil**

```bash
rm -rf src/app/mvpubt
rm -rf src/components/coming-soon
```

(Windows PowerShell kullanıyorsanız: `Remove-Item -Recurse -Force src\app\mvpubt; Remove-Item -Recurse -Force src\components\coming-soon`)

- [ ] **Step 3: `sitemap.ts`'i kontrol et**

`src/app/sitemap.ts:8-11` zaten `""` (kök) girdisini `priority: 1` ile içeriyor ve `mvpubt` için ayrı bir girdi hiç yoktu — değişiklik gerekmez. Sadece dosyayı okuyup mvpubt'ye referans olmadığını doğrula.

- [ ] **Step 4: Kalan `/mvpubt` referanslarını tara**

Run: `grep -rn "mvpubt" src/app next.config.ts src/config 2>/dev/null` (veya PowerShell: `Select-String -Path "src\app\**\*.tsx","src\app\**\*.ts","next.config.ts" -Pattern "mvpubt" -Recurse`)

Beklenen kalıntılar: `src/lib/actions/admin/*.ts` içindeki `revalidatePath("/mvpubt")` çağrıları (ör. `events.ts:12`). Bunları `revalidatePath("/")` olarak güncelle — `/mvp` için olan `revalidatePath("/mvp")` satırlarına DOKUNMA (code freeze, ayrı route, hâlâ var).

Etkilenen dosyaları bul ve her birinde `revalidatePath("/mvpubt")` → `revalidatePath("/")` değişikliğini uygula (muhtemelen `events.ts`, `webinars.ts`, `settings.ts` admin action dosyaları).

- [ ] **Step 5: Derlemeyi doğrula**

Run: `npm run build`
Expected: Hatasız geçer, `/mvpubt` route'unun build çıktısında artık listelenmediğini, `/`'nin var olduğunu doğrula.

- [ ] **Step 6: Manuel test**

`npm run dev` çalıştır:
- `http://localhost:3000/` → mvpubt içeriği (Hero, Statistics, vb.) render edilmeli, BETA rozeti ve Feedback Ver linki navbar'da görünmeli.
- `http://localhost:3000/mvp` → hiç değişmemiş olmalı, code-freeze banner'ı hâlâ görünmeli.
- `http://localhost:3000/mvpubt` → 404 vermeli (route silindi).

- [ ] **Step 7: Commit**

```bash
git add -A src/app/page.tsx src/app/mvpubt src/components/coming-soon
git commit -m "feat(home): mvpubt içeriğini kök route'a taşı, coming-soon'u kaldır"
```

(Not: `revalidatePath` düzeltmeleri yapıldıysa o dosyaları da bu commit'e veya ayrı bir commit'e ekleyin.)

---

## Task 10: Uçtan uca doğrulama

**Files:** Yok (yalnızca manuel test + son derleme kontrolü).

- [ ] **Step 1: Tam build**

Run: `npm run build`
Expected: Sıfır hata, sıfır tip hatası.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: Sıfır hata (yeni eklenen dosyalarda).

- [ ] **Step 3: Uçtan uca manuel akış**

`npm run dev` ile:
1. Giriş yapmadan `/geri-bildirim`'e git → `/giris`'e yönlenmeli.
2. Giriş yap, `/geri-bildirim`'e git, başlık+açıklama+bir görsel ile yeni feedback gönder → listede görünmeli, görsel URL'i DB'de dolu olmalı.
3. Feedback detayına gir, yorum ekle → yorum listede görünmeli.
4. Admin olarak `/admin/feedback`'e git → gönderilen feedback listede görünmeli, durumu "İncelemede" yap → `/geri-bildirim` sayfasında rozet güncellenmiş olmalı.
5. `/` → mvpubt içeriği + BETA rozeti + Feedback Ver linki görünür.
6. `/mvp` → değişmemiş, code-freeze banner'ı hâlâ orada.

- [ ] **Step 4: Son commit (varsa küçük düzeltmeler)**

```bash
git add -A
git commit -m "fix: uçtan uca doğrulama sonrası küçük düzeltmeler"
```

(Düzeltme gerekmediyse bu adımı atla.)

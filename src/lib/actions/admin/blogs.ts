"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  requireAdminContext,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";

const adminBlogSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  slug: z
    .string()
    .min(3, "Slug en az 3 karakter olmalıdır")
    .regex(/^[a-z0-9-]+$/, "Yalnızca küçük harf, rakam ve tire kullanın"),
  category: z.enum(["Blog", "Haber", "Duyuru"]),
  excerpt: z.string().optional(),
  content: z.string().min(10, "İçerik en az 10 karakter olmalıdır"),
  /** Virgülle ayrılmış etiketler. */
  tags: z.string().optional(),
  isPublished: z.boolean(),
});

export type AdminBlogInput = z.infer<typeof adminBlogSchema>;

function revalidateBlogPages(slug?: string) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

/** İçerik uzunluğundan tahmini okuma süresi (~200 kelime/dk). */
function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} dk`;
}

export async function saveBlogPost(input: AdminBlogInput): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const parsed = adminBlogSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }
  const data = parsed.data;

  // published_at ilk yayınlamada atılır, sonraki kayıtlarda korunur.
  let publishedAt: string | null = null;
  if (data.id) {
    const { data: existing } = await supabase
      .from("blogs")
      .select("published_at")
      .eq("id", data.id)
      .maybeSingle();
    publishedAt = existing?.published_at ?? null;
  }
  if (data.isPublished && !publishedAt) {
    publishedAt = new Date().toISOString();
  }

  const tags = (data.tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const row = {
    title: data.title,
    slug: data.slug,
    category: data.category,
    excerpt: data.excerpt || null,
    content: data.content,
    tags,
    read_time: estimateReadTime(data.content),
    is_published: data.isPublished,
    published_at: publishedAt,
  };

  const result = data.id
    ? await supabase.from("blogs").update(row).eq("id", data.id)
    : await supabase.from("blogs").insert(row);

  if (result.error) {
    if (result.error.code === "23505") {
      return { success: false, error: "Bu slug ile bir yazı zaten var." };
    }
    return { success: false, error: result.error.message };
  }

  revalidateBlogPages(data.slug);
  return { success: true };
}

export async function toggleBlogPublished(
  id: string,
  publish: boolean
): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const { data: existing } = await supabase
    .from("blogs")
    .select("slug, published_at")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("blogs")
    .update({
      is_published: publish,
      published_at: publish
        ? (existing?.published_at ?? new Date().toISOString())
        : existing?.published_at ?? null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidateBlogPages(existing?.slug);
  return { success: true };
}

export async function deleteBlogPost(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const { data, error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { success: false, error: error.message };

  revalidateBlogPages(data.slug);
  return { success: true };
}

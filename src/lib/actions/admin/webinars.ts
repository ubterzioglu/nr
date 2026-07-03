"use server";

import { revalidatePath } from "next/cache";
import { adminWebinarSchema } from "@/lib/validations/admin";
import {
  requireAdminContext,
  uploadImage,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";

function revalidateWebinarPages(slug?: string) {
  revalidatePath("/mvpubt");
  revalidatePath("/mvp");
  revalidatePath("/webinarlar");
  if (slug) revalidatePath(`/webinarlar/${slug}`);
}

/** Tarih + saat alanlarını Türkiye saatiyle (UTC+3) ISO'ya çevirir. */
function toWebinarTimestamp(date: string, time: string): string {
  return `${date}T${time}:00+03:00`;
}

function parseWebinarFormData(formData: FormData) {
  return adminWebinarSchema.safeParse({
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    speaker: String(formData.get("speaker") ?? ""),
    webinarDate: String(formData.get("webinarDate") ?? ""),
    webinarTime: String(formData.get("webinarTime") ?? ""),
    capacity: formData.get("capacity") ? String(formData.get("capacity")) : undefined,
    meetingUrl: String(formData.get("meetingUrl") ?? ""),
    recordingUrl: String(formData.get("recordingUrl") ?? ""),
    isFeatured: formData.get("isFeatured") === "true",
    isPublished: formData.get("isPublished") === "true",
  });
}

/** Webinar oluşturur veya (id varsa) günceller; opsiyonel kapak görseli yükler. */
export async function saveWebinar(formData: FormData): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const parsed = parseWebinarFormData(formData);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }
  const data = parsed.data;

  let imageUrl: string | undefined;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    const upload = await uploadImage(
      supabase,
      "event-images",
      `webinars/${data.slug}`,
      imageFile
    );
    if (!upload.ok) return { success: false, error: upload.error };
    imageUrl = upload.url;
  }

  const row = {
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    speaker: data.speaker || null,
    webinar_date: toWebinarTimestamp(data.webinarDate, data.webinarTime),
    capacity: data.capacity ? Number(data.capacity) : null,
    meeting_url: data.meetingUrl || null,
    recording_url: data.recordingUrl || null,
    is_featured: data.isFeatured,
    is_published: data.isPublished,
    updated_at: new Date().toISOString(),
    ...(imageUrl ? { image_url: imageUrl } : {}),
  };

  const result = data.id
    ? await supabase.from("webinars").update(row).eq("id", data.id)
    : await supabase.from("webinars").insert(row);

  if (result.error) {
    if (result.error.code === "23505") {
      return { success: false, error: "Bu slug ile bir webinar zaten var." };
    }
    return { success: false, error: result.error.message };
  }

  revalidateWebinarPages(data.slug);
  return { success: true };
}

export async function toggleWebinarPublished(
  id: string,
  publish: boolean
): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const { data, error } = await supabase
    .from("webinars")
    .update({ is_published: publish, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { success: false, error: error.message };

  revalidateWebinarPages(data.slug);
  return { success: true };
}

export async function deleteWebinar(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const { data, error } = await supabase
    .from("webinars")
    .delete()
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { success: false, error: error.message };

  revalidateWebinarPages(data.slug);
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { adminEventSchema } from "@/lib/validations/admin";
import {
  requireAdminContext,
  uploadImage,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";

function revalidateEventPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/mvp");
  revalidatePath("/etkinlikler");
  if (slug) revalidatePath(`/etkinlikler/${slug}`);
}

function parseEventFormData(formData: FormData) {
  return adminEventSchema.safeParse({
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    eventType: String(formData.get("eventType") ?? "workshop"),
    status: String(formData.get("status") ?? "upcoming"),
    eventDate: String(formData.get("eventDate") ?? ""),
    eventTime: String(formData.get("eventTime") ?? ""),
    speaker: String(formData.get("speaker") ?? ""),
    location: String(formData.get("location") ?? ""),
    capacity: formData.get("capacity") ? String(formData.get("capacity")) : undefined,
    meetingUrl: String(formData.get("meetingUrl") ?? ""),
    registrationUrl: String(formData.get("registrationUrl") ?? ""),
    isPublished: formData.get("isPublished") === "true",
  });
}

/** Etkinlik oluşturur veya (id varsa) günceller; opsiyonel kapak görseli yükler. */
export async function saveEvent(formData: FormData): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const parsed = parseEventFormData(formData);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }
  const data = parsed.data;

  let imageUrl: string | undefined;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    const upload = await uploadImage(supabase, "event-images", `events/${data.slug}`, imageFile);
    if (!upload.ok) return { success: false, error: upload.error };
    imageUrl = upload.url;
  }

  const row = {
    title: data.title,
    slug: data.slug,
    description: data.description || null,
    event_type: data.eventType,
    status: data.status,
    event_date: data.eventDate,
    event_time: data.eventTime || null,
    speaker: data.speaker || null,
    location: data.location || null,
    capacity: data.capacity ? Number(data.capacity) : null,
    meeting_url: data.meetingUrl || null,
    registration_url: data.registrationUrl || null,
    is_published: data.isPublished,
    updated_at: new Date().toISOString(),
    ...(imageUrl ? { image_url: imageUrl } : {}),
  };

  const result = data.id
    ? await supabase.from("events").update(row).eq("id", data.id)
    : await supabase.from("events").insert(row);

  if (result.error) {
    if (result.error.code === "23505") {
      return { success: false, error: "Bu slug ile bir etkinlik zaten var." };
    }
    return { success: false, error: result.error.message };
  }

  revalidateEventPages(data.slug);
  return { success: true };
}

export async function toggleEventPublished(
  id: string,
  publish: boolean
): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const { data, error } = await supabase
    .from("events")
    .update({ is_published: publish, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { success: false, error: error.message };

  revalidateEventPages(data.slug);
  return { success: true };
}

export async function deleteEvent(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { success: false, error: error.message };

  revalidateEventPages(data.slug);
  return { success: true };
}

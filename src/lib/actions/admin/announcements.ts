"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  requireAdminContext,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";

const adminAnnouncementSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  content: z.string().min(5, "İçerik en az 5 karakter olmalıdır"),
  link: z.string().url("Geçerli bir bağlantı girin").optional().or(z.literal("")),
  isPublished: z.boolean(),
});

export type AdminAnnouncementInput = z.infer<typeof adminAnnouncementSchema>;

export async function saveAnnouncement(
  input: AdminAnnouncementInput
): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const parsed = adminAnnouncementSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }
  const data = parsed.data;

  const row = {
    title: data.title,
    content: data.content,
    link: data.link || null,
    is_published: data.isPublished,
    published_at: data.isPublished ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const result = data.id
    ? await supabase.from("announcements").update(row).eq("id", data.id)
    : await supabase.from("announcements").insert(row);

  if (result.error) return { success: false, error: result.error.message };

  revalidatePath("/admin/announcements");
  return { success: true };
}

export async function deleteAnnouncement(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/announcements");
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  requireAdminContext,
  uploadImage,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";

const adminSponsorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Sponsor adı en az 2 karakter olmalıdır"),
  tier: z.enum(["platinum", "gold", "silver", "partner"]),
  websiteUrl: z.string().url("Geçerli bir bağlantı girin").optional().or(z.literal("")),
  description: z.string().optional(),
  sortOrder: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), "Sıralama sayı olmalıdır"),
  isActive: z.boolean(),
});

function revalidateSponsorPages() {
  revalidatePath("/sponsorlar");
  revalidatePath("/mvpubt");
  revalidatePath("/admin/sponsors");
}

/** Sponsor oluşturur/günceller; opsiyonel logo yükler (content.pdf §15). */
export async function saveSponsor(formData: FormData): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const parsed = adminSponsorSchema.safeParse({
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    name: String(formData.get("name") ?? ""),
    tier: String(formData.get("tier") ?? "partner"),
    websiteUrl: String(formData.get("websiteUrl") ?? ""),
    description: String(formData.get("description") ?? ""),
    sortOrder: formData.get("sortOrder") ? String(formData.get("sortOrder")) : undefined,
    isActive: formData.get("isActive") === "true",
  });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }
  const data = parsed.data;

  let logoUrl: string | undefined;
  const logoFile = formData.get("logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    const upload = await uploadImage(
      supabase,
      "event-images",
      `sponsors/${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      logoFile
    );
    if (!upload.ok) return { success: false, error: upload.error };
    logoUrl = upload.url;
  }

  const row = {
    name: data.name,
    tier: data.tier,
    website_url: data.websiteUrl || null,
    description: data.description || null,
    sort_order: data.sortOrder ? Number(data.sortOrder) : 0,
    is_active: data.isActive,
    updated_at: new Date().toISOString(),
    ...(logoUrl ? { logo_url: logoUrl } : {}),
  };

  const result = data.id
    ? await supabase.from("sponsors").update(row).eq("id", data.id)
    : await supabase.from("sponsors").insert(row);

  if (result.error) return { success: false, error: result.error.message };

  revalidateSponsorPages();
  return { success: true };
}

export async function toggleSponsorActive(
  id: string,
  isActive: boolean
): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("sponsors")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidateSponsorPages();
  return { success: true };
}

export async function deleteSponsor(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("sponsors")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidateSponsorPages();
  return { success: true };
}

/** Sponsor/iş birliği başvurusunu okundu işaretler. */
export async function setSponsorInquiryRead(
  id: string,
  isRead: boolean
): Promise<AdminActionResult> {
  const guard = await requireAdminContext("inbox");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("sponsor_inquiries")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/sponsors");
  return { success: true };
}

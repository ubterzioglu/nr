"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  requireAdminContext,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";
import { HERO_SETTING_KEY, SOCIAL_SETTING_KEY } from "@/lib/data/settings";
import type { Json } from "@/types/database";

const optionalUrl = z
  .string()
  .url("Geçerli bir bağlantı girin")
  .optional()
  .or(z.literal(""));

const heroSettingsSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  primaryCtaLabel: z.string().min(2, "Buton metni gerekli"),
  primaryCtaHref: z.string().min(1, "Buton bağlantısı gerekli"),
  secondaryCtaLabel: z.string().min(2, "Buton metni gerekli"),
  secondaryCtaHref: z.string().min(1, "Buton bağlantısı gerekli"),
});

export type HeroSettingsInput = z.infer<typeof heroSettingsSchema>;

const socialSettingsSchema = z.object({
  instagram: optionalUrl,
  youtube: optionalUrl,
  linkedin: optionalUrl,
  whatsappChannel: optionalUrl,
  whatsappCommunity: optionalUrl,
  discord: optionalUrl,
  telegram: optionalUrl,
});

export type SocialSettingsInput = z.infer<typeof socialSettingsSchema>;

async function upsertSetting(key: string, value: Json): Promise<AdminActionResult> {
  const guard = await requireAdminContext("settings");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/** /mvpubt hero başlık/açıklama/buton metinleri (content.pdf §34). */
export async function saveHeroSettings(
  input: HeroSettingsInput
): Promise<AdminActionResult> {
  const parsed = heroSettingsSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }

  const result = await upsertSetting(HERO_SETTING_KEY, parsed.data);
  if (!result.success) return result;

  revalidatePath("/mvpubt");
  revalidatePath("/admin/settings");
  return { success: true };
}

/** Sosyal medya / topluluk bağlantıları (content.pdf §34 + topluluk modülü). */
export async function saveSocialSettings(
  input: SocialSettingsInput
): Promise<AdminActionResult> {
  const parsed = socialSettingsSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }

  const result = await upsertSetting(SOCIAL_SETTING_KEY, parsed.data);
  if (!result.success) return result;

  revalidatePath("/mvpubt");
  revalidatePath("/admin/settings");
  return { success: true };
}

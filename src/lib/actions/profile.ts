"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/actions/admin/shared";
import { interestOptions } from "@/config/interests";

type ActionResult = { success: true } | { success: false; error: string };

const optionalUrl = z
  .string()
  .url("Geçerli bir bağlantı girin")
  .optional()
  .or(z.literal(""));

const profileSchema = z.object({
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  username: z
    .string()
    .regex(/^[a-z0-9_.]{3,20}$/, "Kullanıcı adı 3-20 karakter; küçük harf, rakam, _ ve .")
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, "Biyografi en fazla 500 karakter").optional(),
  city: z.string().optional(),
  university: z.string().optional(),
  highSchool: z.string().optional(),
  profession: z.string().optional(),
  websiteUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  instagramUrl: optionalUrl,
  newsletterOptIn: z.boolean(),
  kvkkConsent: z.boolean().optional(),
});

/** Üyenin kendi profilini günceller (content.pdf §2). */
export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Bu işlem için giriş yapmanız gerekir." };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "Veritabanı yapılandırılmamış." };
  }

  const parsed = profileSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    username: String(formData.get("username") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    city: String(formData.get("city") ?? ""),
    university: String(formData.get("university") ?? ""),
    highSchool: String(formData.get("highSchool") ?? ""),
    profession: String(formData.get("profession") ?? ""),
    websiteUrl: String(formData.get("websiteUrl") ?? ""),
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
    githubUrl: String(formData.get("githubUrl") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    newsletterOptIn: formData.get("newsletterOptIn") === "true",
    kvkkConsent: formData.get("kvkkConsent") === "true",
  });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }
  const data = parsed.data;

  // İlgi alanları sabit listeden süzülür
  const interests = formData
    .getAll("interests")
    .map(String)
    .filter((interest) => (interestOptions as readonly string[]).includes(interest));

  let avatarUrl: string | undefined;
  const avatarFile = formData.get("avatar");
  if (avatarFile instanceof File && avatarFile.size > 0) {
    const upload = await uploadImage(
      supabase,
      "avatars",
      `users/${currentUser.authUser.id}`,
      avatarFile
    );
    if (!upload.ok) return { success: false, error: upload.error };
    avatarUrl = upload.url;
  }

  // Google ile kayıt olan üyelerde KVKK onayı profilden alınabilir
  const missingConsent = !currentUser.profile?.kvkk_consent_at;

  const { error } = await supabase
    .from("users")
    .update({
      full_name: data.fullName,
      username: data.username || null,
      bio: data.bio || null,
      city: data.city || null,
      university: data.university || null,
      high_school: data.highSchool || null,
      profession: data.profession || null,
      website_url: data.websiteUrl || null,
      linkedin_url: data.linkedinUrl || null,
      github_url: data.githubUrl || null,
      instagram_url: data.instagramUrl || null,
      interests,
      newsletter_opt_in: data.newsletterOptIn,
      updated_at: new Date().toISOString(),
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      ...(missingConsent && data.kvkkConsent
        ? { kvkk_consent_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", currentUser.authUser.id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Bu kullanıcı adı zaten alınmış." };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/profil");
  return { success: true };
}

/** Üyenin kendi etkinlik kaydını iptal etmesi (profil sayfasından). */
export async function cancelOwnRegistration(
  registrationId: string
): Promise<ActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Bu işlem için giriş yapmanız gerekir." };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "Veritabanı yapılandırılmamış." };
  }

  const { data: registration } = await supabase
    .from("event_registrations")
    .select("id, user_id, email, status")
    .eq("id", registrationId)
    .maybeSingle();

  const ownsRegistration =
    registration &&
    (registration.user_id === currentUser.authUser.id ||
      registration.email.toLowerCase() ===
        (currentUser.authUser.email ?? "").toLowerCase());

  if (!ownsRegistration) {
    return { success: false, error: "Kayıt bulunamadı." };
  }
  if (registration.status === "cancelled") {
    return { success: true };
  }

  const { error } = await supabase
    .from("event_registrations")
    .update({ status: "cancelled" })
    .eq("id", registrationId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/profil");
  return { success: true };
}

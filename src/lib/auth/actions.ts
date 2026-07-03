"use server";

import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import {
  signUpSchema,
  signInSchema,
  resetRequestSchema,
  newPasswordSchema,
  type SignUpFormData,
  type SignInFormData,
  type ResetRequestFormData,
  type NewPasswordFormData,
} from "@/lib/validations/auth";

type ActionResult = { success: true } | { success: false; error: string };

const AUTH_UNAVAILABLE =
  "Üyelik sistemi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/** Supabase Auth hata mesajlarını kullanıcıya dönük Türkçe metne çevirir. */
function translateAuthError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("already registered")) {
    return "Bu e-posta adresiyle zaten bir hesap var. Giriş yapmayı deneyin.";
  }
  if (normalized.includes("invalid login credentials")) {
    return "E-posta veya şifre hatalı.";
  }
  if (normalized.includes("email not confirmed")) {
    return "E-posta adresiniz henüz doğrulanmamış. Gelen kutunuzu kontrol edin.";
  }
  if (normalized.includes("password should be")) {
    return "Şifre en az 8 karakter olmalıdır.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.";
  }
  return "İşlem tamamlanamadı. Lütfen tekrar deneyin.";
}

export async function signUp(data: SignUpFormData): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Geçersiz form verisi." };
  }

  const supabase = await createAuthServerClient();
  if (!supabase) {
    return { success: false, error: AUTH_UNAVAILABLE };
  }

  const { data: result, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${siteUrl()}/auth/callback?next=/giris?dogrulandi=1`,
    },
  });

  if (error) {
    return { success: false, error: translateAuthError(error.message) };
  }

  // KVKK onay zamanını profile işle (trigger profili signUp sırasında açar).
  if (result.user) {
    const service = createServerClient();
    if (service) {
      const { error: consentError } = await service
        .from("users")
        .update({ kvkk_consent_at: new Date().toISOString() })
        .eq("id", result.user.id);
      if (consentError) {
        console.error("[NEXRISE] KVKK onayı kaydedilemedi:", consentError.message);
      }
    }
  }

  return { success: true };
}

export async function signIn(data: SignInFormData): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Geçersiz form verisi." };
  }

  const supabase = await createAuthServerClient();
  if (!supabase) {
    return { success: false, error: AUTH_UNAVAILABLE };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: translateAuthError(error.message) };
  }

  return { success: true };
}

export async function signInWithGoogle(): Promise<never | ActionResult> {
  const supabase = await createAuthServerClient();
  if (!supabase) {
    return { success: false, error: AUTH_UNAVAILABLE };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl()}/auth/callback?next=/`,
    },
  });

  if (error || !data.url) {
    return {
      success: false,
      error: "Google ile giriş şu anda kullanılamıyor. Lütfen e-posta ile deneyin.",
    };
  }

  redirect(data.url);
}

export async function signOutUser(): Promise<void> {
  const supabase = await createAuthServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/");
}

export async function requestPasswordReset(
  data: ResetRequestFormData
): Promise<ActionResult> {
  const parsed = resetRequestSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Geçersiz form verisi." };
  }

  const supabase = await createAuthServerClient();
  if (!supabase) {
    return { success: false, error: AUTH_UNAVAILABLE };
  }

  // Hesabın var olup olmadığı bilgisini sızdırmamak için hata durumunda da
  // başarı mesajı gösterilir (rate limit hariç sessizce loglanır).
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/sifre-sifirla/yeni`,
  });
  if (error) {
    console.error("[NEXRISE] Şifre sıfırlama isteği hatası:", error.message);
  }

  return { success: true };
}

export async function updatePassword(data: NewPasswordFormData): Promise<ActionResult> {
  const parsed = newPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Geçersiz form verisi." };
  }

  const supabase = await createAuthServerClient();
  if (!supabase) {
    return { success: false, error: AUTH_UNAVAILABLE };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { success: false, error: translateAuthError(error.message) };
  }

  return { success: true };
}

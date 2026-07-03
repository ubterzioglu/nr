"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import type { AdminRole } from "@/types/database";

const COOKIE_NAME = "nexrise_admin";

type ActionResult = { success: true } | { success: false; error: string };

export type AdminSession =
  | {
      kind: "supabase";
      userId: string;
      email: string;
      fullName: string | null;
      adminRole: AdminRole;
    }
  // Geçiş dönemi: ADMIN_SECRET ortak şifresiyle açılmış eski oturum.
  // ADMIN_LEGACY_LOGIN=false ile kapatılır (Faz 1 sonunda kaldırılacak).
  | { kind: "legacy" }
  // ADMIN_SECRET tanımsızken geliştirme kolaylığı.
  | { kind: "dev" };

function legacyLoginEnabled(): boolean {
  return Boolean(process.env.ADMIN_SECRET) && process.env.ADMIN_LEGACY_LOGIN !== "false";
}

async function getSupabaseAdminSession(): Promise<AdminSession | null> {
  const supabase = await createAuthServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("email, full_name, admin_role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.admin_role || !profile.is_active) return null;

  return {
    kind: "supabase",
    userId: user.id,
    email: profile.email,
    fullName: profile.full_name,
    adminRole: profile.admin_role,
  };
}

/**
 * Aktif admin oturumu: önce Supabase Auth + admin_role, sonra (etkinse)
 * eski ortak şifre çerezi, en son geliştirme modu istisnası.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabaseSession = await getSupabaseAdminSession();
  if (supabaseSession) return supabaseSession;

  if (legacyLoginEnabled()) {
    const store = await cookies();
    if (store.get(COOKIE_NAME)?.value === "authenticated") {
      return { kind: "legacy" };
    }
  }

  if (!process.env.ADMIN_SECRET && process.env.NODE_ENV === "development") {
    return { kind: "dev" };
  }

  return null;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}

/** E-posta + şifre ile admin girişi (users.admin_role zorunlu). */
export async function adminSignIn(data: SignInFormData): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Geçersiz form verisi." };
  }

  const supabase = await createAuthServerClient();
  if (!supabase) {
    return {
      success: false,
      error: "Üyelik sistemi yapılandırılmamış. Yönetici şifresiyle giriş yapın.",
    };
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !authData.user) {
    return { success: false, error: "E-posta veya şifre hatalı." };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("admin_role, is_active")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!profile?.admin_role || !profile.is_active) {
    await supabase.auth.signOut();
    return { success: false, error: "Bu hesabın yönetim paneli yetkisi yok." };
  }

  return { success: true };
}

/** Eski ortak şifre ile giriş — yalnızca geçiş döneminde. */
export async function loginAdmin(password: string): Promise<ActionResult> {
  const secret = process.env.ADMIN_SECRET;
  if (!legacyLoginEnabled() || !secret || password !== secret) {
    return { success: false, error: "Geçersiz şifre" };
  }

  const store = await cookies();
  store.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true };
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(COOKIE_NAME);

  const supabase = await createAuthServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}

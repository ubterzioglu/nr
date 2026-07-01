"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "nexrise_admin";

export async function loginAdmin(password: string) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || password !== secret) {
    return { success: false as const, error: "Geçersiz şifre" };
  }

  const store = await cookies();
  store.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true as const };
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";

  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "authenticated";
}

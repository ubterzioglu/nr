"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  logAdminAction,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";
import { isSuperAdmin } from "@/lib/admin/permissions";
import type { AdminRole, UserRole } from "@/types/database";

const ADMIN_ROLES: (AdminRole | "")[] = ["", "super_admin", "admin", "editor", "moderator"];
const COMMUNITY_ROLES: UserRole[] = [
  "visitor",
  "member",
  "volunteer",
  "president",
  "vice_president",
  "board_chair",
  "admin",
];

/** Panel yetkisi atama — yalnızca süper admin. Boş string yetkiyi kaldırır. */
export async function setUserAdminRole(
  userId: string,
  adminRole: AdminRole | ""
): Promise<AdminActionResult> {
  const guard = await requireAdminContext("users");
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase, session } = guard.context;

  if (!isSuperAdmin(session)) {
    return { success: false, error: "Panel yetkisini yalnızca Süper Admin atayabilir." };
  }
  if (!ADMIN_ROLES.includes(adminRole)) {
    return { success: false, error: "Geçersiz yetki." };
  }
  if (session.kind === "supabase" && session.userId === userId && adminRole !== "super_admin") {
    return { success: false, error: "Kendi süper admin yetkinizi düşüremezsiniz." };
  }

  const { error } = await supabase
    .from("users")
    .update({ admin_role: adminRole === "" ? null : adminRole })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };

  await logAdminAction(
    guard.context,
    "panel-yetkisi-atandi",
    "users",
    userId,
    adminRole === "" ? "yetki kaldırıldı" : adminRole
  );
  revalidatePath("/admin/users");
  return { success: true };
}

/** Topluluk rolü atama (Üye/Gönüllü/Başkan…). */
export async function setUserCommunityRole(
  userId: string,
  roleName: UserRole
): Promise<AdminActionResult> {
  const guard = await requireAdminContext("users");
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  if (!COMMUNITY_ROLES.includes(roleName)) {
    return { success: false, error: "Geçersiz rol." };
  }

  const { data: role } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName)
    .maybeSingle();
  if (!role) {
    return { success: false, error: "Rol kaydı bulunamadı (roles seed eksik olabilir)." };
  }

  const { error } = await supabase
    .from("users")
    .update({ role_id: role.id })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}

/** Üyeyi pasife alma / aktifleştirme. Pasif üye giriş yapamaz sayılır. */
export async function setUserActive(
  userId: string,
  isActive: boolean
): Promise<AdminActionResult> {
  const guard = await requireAdminContext("users");
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase, session } = guard.context;

  if (session.kind === "supabase" && session.userId === userId && !isActive) {
    return { success: false, error: "Kendi hesabınızı pasife alamazsınız." };
  }

  const { error } = await supabase
    .from("users")
    .update({ is_active: isActive })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };

  await logAdminAction(
    guard.context,
    isActive ? "uye-aktiflestirildi" : "uye-pasife-alindi",
    "users",
    userId
  );
  revalidatePath("/admin/users");
  return { success: true };
}

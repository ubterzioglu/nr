import type { AdminRole } from "@/types/database";
import type { AdminSession } from "@/lib/admin/session";

/**
 * Panel modül grupları (content.pdf §1 rol matrisi):
 * - content: blog, duyuru, ekip, başkanlıklar, sponsor içerikleri
 * - events: etkinlik/webinar CRUD, katılımcı, yoklama, sertifika
 * - inbox: başvurular + iletişim mesajları
 * - mail: mail merkezi
 * - users: üye yönetimi (rol atama yalnız süper admin)
 * - settings: site ayarları
 * - community: topluluk/moderasyon (revizyon istekleri, ileride akış)
 */
export type AdminModule =
  | "content"
  | "events"
  | "inbox"
  | "mail"
  | "users"
  | "settings"
  | "community";

const MODULE_MATRIX: Record<AdminRole, AdminModule[] | "all"> = {
  super_admin: "all",
  admin: "all",
  editor: ["content", "events"],
  moderator: ["community", "inbox"],
};

export function roleCanAccess(role: AdminRole, module: AdminModule): boolean {
  const allowed = MODULE_MATRIX[role];
  return allowed === "all" || allowed.includes(module);
}

/** Legacy/dev oturumları geçiş döneminde tam yetkilidir. */
export function sessionCanAccess(session: AdminSession, module: AdminModule): boolean {
  if (session.kind !== "supabase") return true;
  return roleCanAccess(session.adminRole, module);
}

export function isSuperAdmin(session: AdminSession): boolean {
  return session.kind !== "supabase" || session.adminRole === "super_admin";
}

export const adminRoleLabels: Record<AdminRole, string> = {
  super_admin: "Süper Admin",
  admin: "Admin",
  editor: "Editör",
  moderator: "Moderatör",
};

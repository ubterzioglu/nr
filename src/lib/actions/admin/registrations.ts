"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";

function revalidateRegistrationPages(targetType: "event" | "webinar", targetId: string) {
  const base = targetType === "event" ? "/admin/events" : "/admin/webinars";
  revalidatePath(`${base}/${targetId}/registrations`);
}

/** Tek katılımcının yoklama durumunu günceller (null = işaretsiz). */
export async function markAttendance(
  id: string,
  targetType: "event" | "webinar",
  targetId: string,
  attended: boolean | null
): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("event_registrations")
    .update({ attended })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidateRegistrationPages(targetType, targetId);
  return { success: true };
}

/** İşaretlenmemiş tüm aktif kayıtları toplu olarak katıldı/katılmadı yapar. */
export async function markAllUnsetAttendance(
  targetType: "event" | "webinar",
  targetId: string,
  attended: boolean
): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };

  const column = targetType === "event" ? "event_id" : "webinar_id";
  const { error } = await guard.context.supabase
    .from("event_registrations")
    .update({ attended })
    .eq(column, targetId)
    .eq("status", "registered")
    .is("attended", null);

  if (error) return { success: false, error: error.message };

  revalidateRegistrationPages(targetType, targetId);
  return { success: true };
}

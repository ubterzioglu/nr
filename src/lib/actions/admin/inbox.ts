"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function setContactRead(
  id: string,
  isRead: boolean
): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("contacts")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/contacts");
  return { success: true };
}

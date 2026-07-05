"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";
import type { FeedbackStatus } from "@/types/database";

const VALID_STATUSES: FeedbackStatus[] = ["open", "reviewing", "resolved", "rejected"];

export async function setFeedbackStatus(
  id: string,
  status: FeedbackStatus
): Promise<AdminActionResult> {
  const guard = await requireAdminContext("community");
  if (!guard.ok) return { success: false, error: guard.error };

  if (!VALID_STATUSES.includes(status)) {
    return { success: false, error: "Geçersiz durum." };
  }

  const { error } = await guard.context.supabase
    .from("feedback")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/feedback");
  revalidatePath("/geri-bildirim");
  revalidatePath(`/geri-bildirim/${id}`);
  return { success: true };
}

export async function deleteFeedback(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext("community");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("feedback")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/feedback");
  revalidatePath("/geri-bildirim");
  return { success: true };
}

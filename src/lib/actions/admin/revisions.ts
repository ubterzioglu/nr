"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";

export type RevisionStatus = "open" | "planned" | "done" | "rejected";

const VALID_STATUSES: RevisionStatus[] = ["open", "planned", "done", "rejected"];

export async function setRevisionStatus(
  id: string,
  status: RevisionStatus
): Promise<AdminActionResult> {
  const guard = await requireAdminContext("community");
  if (!guard.ok) return { success: false, error: guard.error };

  if (!VALID_STATUSES.includes(status)) {
    return { success: false, error: "Geçersiz durum." };
  }

  const { error } = await guard.context.supabase
    .from("revision_requests")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/revisions");
  revalidatePath("/revizyon-istekleri");
  revalidatePath(`/revizyon-istekleri/${id}`);
  return { success: true };
}

export async function deleteRevisionRequest(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext("community");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("revision_requests")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/revisions");
  revalidatePath("/revizyon-istekleri");
  return { success: true };
}

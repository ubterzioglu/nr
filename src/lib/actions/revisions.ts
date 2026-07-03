"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { getAdminSession } from "@/lib/admin/session";

type ActionResult = { success: true } | { success: false; error: string };

const requestSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
});

const commentSchema = z.object({
  requestId: z.string().uuid(),
  body: z.string().min(2, "Yorum en az 2 karakter olmalıdır"),
});

/** Üye yeni revizyon isteği açar (giriş zorunlu). */
export async function createRevisionRequest(input: {
  title: string;
  description: string;
}): Promise<ActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Revizyon isteği açmak için giriş yapmalısınız." };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "Veritabanı yapılandırılmamış." };
  }

  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }

  const { error } = await supabase.from("revision_requests").insert({
    user_id: currentUser.authUser.id,
    author_name:
      currentUser.profile?.full_name ?? currentUser.authUser.email ?? "Üye",
    title: parsed.data.title,
    description: parsed.data.description,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/revizyon-istekleri");
  revalidatePath("/admin/revisions");
  return { success: true };
}

/** İsteğin altına yorum — üye veya admin (admin yorumu rozetli görünür). */
export async function addRevisionComment(input: {
  requestId: string;
  body: string;
}): Promise<ActionResult> {
  const [currentUser, adminSession] = await Promise.all([
    getCurrentUser(),
    getAdminSession(),
  ]);
  if (!currentUser && !adminSession) {
    return { success: false, error: "Yorum yapmak için giriş yapmalısınız." };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "Veritabanı yapılandırılmamış." };
  }

  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz yorum." };
  }

  const isAdmin = Boolean(adminSession);
  const authorName = isAdmin
    ? adminSession?.kind === "supabase"
      ? (adminSession.fullName ?? "NEXRISE Yönetim")
      : "NEXRISE Yönetim"
    : (currentUser?.profile?.full_name ?? currentUser?.authUser.email ?? "Üye");

  const { error } = await supabase.from("revision_comments").insert({
    request_id: parsed.data.requestId,
    user_id: currentUser?.authUser.id ?? null,
    author_name: authorName,
    is_admin: isAdmin,
    body: parsed.data.body,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/revizyon-istekleri/${parsed.data.requestId}`);
  revalidatePath("/admin/revisions");
  return { success: true };
}

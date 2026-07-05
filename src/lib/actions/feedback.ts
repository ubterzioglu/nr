"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { getAdminSession } from "@/lib/admin/session";
import { uploadImage } from "@/lib/actions/admin/shared";
import { feedbackSchema } from "@/lib/validations/forms";

type ActionResult = { success: true } | { success: false; error: string };

const commentSchema = z.object({
  feedbackId: z.string().uuid(),
  body: z.string().min(2, "Yorum en az 2 karakter olmalıdır"),
});

/** Üye yeni feedback açar (giriş zorunlu); opsiyonel görsel eki yükler. */
export async function createFeedback(formData: FormData): Promise<ActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Geri bildirim göndermek için giriş yapmalısınız." };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "Veritabanı yapılandırılmamış." };
  }

  const parsed = feedbackSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }

  let imageUrl: string | undefined;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    const upload = await uploadImage(
      supabase,
      "feedback-attachments",
      `feedback/${currentUser.authUser.id}`,
      imageFile
    );
    if (!upload.ok) return { success: false, error: upload.error };
    imageUrl = upload.url;
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: currentUser.authUser.id,
    author_name:
      currentUser.profile?.full_name ?? currentUser.authUser.email ?? "Üye",
    title: parsed.data.title,
    description: parsed.data.description,
    image_url: imageUrl ?? null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/geri-bildirim");
  revalidatePath("/admin/feedback");
  return { success: true };
}

/** Feedback altına yorum — üye veya admin (admin yorumu rozetli görünür). */
export async function addFeedbackComment(input: {
  feedbackId: string;
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

  const { error } = await supabase.from("feedback_comments").insert({
    feedback_id: parsed.data.feedbackId,
    user_id: currentUser?.authUser.id ?? null,
    author_name: authorName,
    is_admin: isAdmin,
    body: parsed.data.body,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/geri-bildirim/${parsed.data.feedbackId}`);
  revalidatePath("/admin/feedback");
  return { success: true };
}

import { getTransporter } from "@/lib/email/send-notification";
import { createServerClient } from "@/lib/supabase/client";
import type { UserEmailTemplate } from "@/lib/email/templates";

export interface UserEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  template: UserEmailTemplate;
  attachments?: { filename: string; content: Buffer | string; contentType: string }[];
  relatedEventId?: string | null;
  relatedWebinarId?: string | null;
}

/**
 * Kullanıcıya dönük e-posta gönderir ve sonucu email_log tablosuna işler.
 * Log yazımı best-effort'tur; gönderim sonucunu değiştirmez.
 */
export async function sendUserEmail(
  input: UserEmailInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const transporter = getTransporter();

  let sendError: string | null = null;
  if (!transporter) {
    sendError = "SMTP yapılandırılmamış";
  } else {
    const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "";
    try {
      await transporter.sendMail({
        from: `NEXRISE <${from}>`,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
        attachments: input.attachments,
      });
    } catch (error) {
      sendError = error instanceof Error ? error.message : "E-posta gönderilemedi";
    }
  }

  const supabase = createServerClient();
  if (supabase) {
    const { error: logError } = await supabase.from("email_log").insert({
      recipient: input.to,
      subject: input.subject,
      template: input.template,
      status: sendError ? "failed" : "sent",
      error: sendError,
      related_event_id: input.relatedEventId ?? null,
      related_webinar_id: input.relatedWebinarId ?? null,
    });
    if (logError) {
      console.error("[NEXRISE] email_log yazılamadı:", logError.message);
    }
  }

  if (sendError) {
    console.error("[NEXRISE] Kullanıcı maili gönderilemedi:", sendError);
    return { ok: false, error: sendError };
  }
  return { ok: true };
}

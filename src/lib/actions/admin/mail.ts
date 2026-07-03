"use server";

import { z } from "zod";
import {
  requireAdminContext,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";
import { genericEmail, type UserEmailTemplate } from "@/lib/email/templates";
import { sendUserEmail } from "@/lib/email/send-user-email";

const BATCH_SIZE = 20;
const BATCH_DELAY_MS = 3000;
const SEND_DELAY_MS = 300;

const bulkMailSchema = z.object({
  audience: z.enum(["registered", "attended", "newsletter"]),
  /** "event:{id}" | "webinar:{id}" — bülten hedefinde boş. */
  target: z.string().optional(),
  template: z.enum(["reminder", "thank-you", "newsletter", "custom"]),
  subject: z.string().min(3, "Konu en az 3 karakter olmalıdır"),
  body: z.string().min(10, "İçerik en az 10 karakter olmalıdır"),
});

export type BulkMailInput = z.infer<typeof bulkMailSchema>;

type Recipient = { email: string; unsubscribeUrl?: string };

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mail merkezi toplu gönderimi: etkinlik kayıtlıları, katılanları veya
 * bülten aboneleri. SMTP limitleri için partiler hâlinde gönderir;
 * her mail email_log'a işlenir.
 */
export async function sendBulkMail(input: BulkMailInput): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const parsed = bulkMailSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }
  const data = parsed.data;

  // Alıcı listesi
  let recipients: Recipient[] = [];
  let relatedEventId: string | null = null;
  let relatedWebinarId: string | null = null;

  if (data.audience === "newsletter") {
    const { data: subscribers, error } = await supabase
      .from("users")
      .select("email, newsletter_token")
      .eq("newsletter_opt_in", true)
      .eq("is_active", true);
    if (error) return { success: false, error: error.message };
    recipients = (subscribers ?? []).map((user) => ({
      email: user.email,
      unsubscribeUrl: `${siteUrl()}/bulten-iptal/${user.newsletter_token}`,
    }));
  } else {
    const [targetType, targetId] = (data.target ?? "").split(":");
    if ((targetType !== "event" && targetType !== "webinar") || !targetId) {
      return { success: false, error: "Lütfen bir etkinlik seçin." };
    }
    relatedEventId = targetType === "event" ? targetId : null;
    relatedWebinarId = targetType === "webinar" ? targetId : null;

    let query = supabase
      .from("event_registrations")
      .select("email")
      .eq(targetType === "event" ? "event_id" : "webinar_id", targetId)
      .eq("status", "registered");
    if (data.audience === "attended") query = query.eq("attended", true);

    const { data: registrations, error } = await query;
    if (error) return { success: false, error: error.message };
    recipients = (registrations ?? []).map((row) => ({ email: row.email }));
  }

  // Aynı adrese çift gönderimi engelle
  const seen = new Set<string>();
  recipients = recipients.filter((recipient) => {
    const key = recipient.email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (recipients.length === 0) {
    return { success: false, error: "Bu hedefte gönderilecek alıcı bulunamadı." };
  }

  let sent = 0;
  let failed = 0;

  for (let index = 0; index < recipients.length; index += 1) {
    const recipient = recipients[index];
    const rendered = genericEmail({
      title: data.subject,
      bodyText: data.body,
      unsubscribeUrl: recipient.unsubscribeUrl,
    });

    const result = await sendUserEmail({
      to: recipient.email,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      template: data.template as UserEmailTemplate,
      relatedEventId,
      relatedWebinarId,
    });

    if (result.ok) sent += 1;
    else failed += 1;

    // Parti sonunda uzun, parti içinde kısa bekleme (SMTP rate limit)
    const isBatchBoundary = (index + 1) % BATCH_SIZE === 0;
    if (index < recipients.length - 1) {
      await wait(isBatchBoundary ? BATCH_DELAY_MS : SEND_DELAY_MS);
    }
  }

  if (failed > 0) {
    return {
      success: false,
      error: `${sent} mail gönderildi, ${failed} başarısız. Hatalar email_log kaydında; tekrar deneyebilirsiniz.`,
    };
  }
  return { success: true };
}

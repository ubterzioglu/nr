"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdminContext,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";
import {
  generateCertificatePdf,
  generateCertificateCode,
} from "@/lib/certificates/generate";
import { certificateEmail } from "@/lib/email/templates";
import { sendUserEmail } from "@/lib/email/send-user-email";

const SEND_DELAY_MS = 400;

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Etkinliğin "katıldı" işaretli kayıtlarına sertifika üretir ve PDF ekli
 * mail gönderir. Tekrar çalıştırıldığında yalnızca sertifikası olmayan
 * veya maili başarısız olmuş katılımcılar işlenir (güvenle yeniden
 * tetiklenebilir).
 */
export async function sendCertificates(
  targetType: "event" | "webinar",
  targetId: string
): Promise<AdminActionResult> {
  const guard = await requireAdminContext();
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  // Hedef başlık + tarih
  let eventTitle: string;
  let eventDateIso: string | null;
  if (targetType === "event") {
    const { data } = await supabase
      .from("events")
      .select("title, event_date")
      .eq("id", targetId)
      .maybeSingle();
    if (!data) return { success: false, error: "Etkinlik bulunamadı." };
    eventTitle = data.title;
    eventDateIso = data.event_date;
  } else {
    const { data } = await supabase
      .from("webinars")
      .select("title, webinar_date")
      .eq("id", targetId)
      .maybeSingle();
    if (!data) return { success: false, error: "Webinar bulunamadı." };
    eventTitle = data.title;
    eventDateIso = data.webinar_date?.slice(0, 10) ?? null;
  }

  const dateLabel = eventDateIso
    ? new Date(`${eventDateIso}T00:00:00`).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const column = targetType === "event" ? "event_id" : "webinar_id";
  const { data: attendees, error: attendeesError } = await supabase
    .from("event_registrations")
    .select("id, full_name, email")
    .eq(column, targetId)
    .eq("status", "registered")
    .eq("attended", true);

  if (attendeesError) {
    return { success: false, error: attendeesError.message };
  }
  if (!attendees || attendees.length === 0) {
    return {
      success: false,
      error: "Katıldı olarak işaretlenmiş kayıt yok. Önce yoklama alın.",
    };
  }

  // Mevcut sertifikalar + başarıyla gönderilmiş sertifika mailleri
  const registrationIds = attendees.map((attendee) => attendee.id);
  const [{ data: existingCertificates }, { data: sentEmails }] = await Promise.all([
    supabase
      .from("certificates")
      .select("registration_id, code")
      .in("registration_id", registrationIds),
    supabase
      .from("email_log")
      .select("recipient")
      .eq("template", "certificate")
      .eq("status", "sent")
      .eq(targetType === "event" ? "related_event_id" : "related_webinar_id", targetId),
  ]);

  const certificateByRegistration = new Map(
    (existingCertificates ?? []).map((certificate) => [
      certificate.registration_id,
      certificate.code,
    ])
  );
  const sentRecipients = new Set((sentEmails ?? []).map((row) => row.recipient));

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const attendee of attendees) {
    const alreadySent = sentRecipients.has(attendee.email);
    const existingCode = certificateByRegistration.get(attendee.id);

    if (existingCode && alreadySent) {
      skipped += 1;
      continue;
    }

    try {
      const code = existingCode ?? generateCertificateCode();
      const verifyUrl = `${siteUrl()}/sertifika-dogrula/${code}`;

      const pdfBytes = await generateCertificatePdf({
        fullName: attendee.full_name,
        eventTitle,
        dateLabel,
        code,
        verifyUrl,
      });

      if (!existingCode) {
        const pdfPath = `certs/${code}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from("certificates")
          .upload(pdfPath, pdfBytes, { contentType: "application/pdf" });
        // Depolama hatası ölümcül değil; mail eki yine de gönderilir.
        if (uploadError) {
          console.error("[NEXRISE] Sertifika PDF yüklenemedi:", uploadError.message);
        }

        const { error: insertError } = await supabase.from("certificates").insert({
          registration_id: attendee.id,
          code,
          full_name: attendee.full_name,
          event_title: eventTitle,
          event_date: eventDateIso,
          pdf_path: uploadError ? null : pdfPath,
        });
        if (insertError) {
          console.error("[NEXRISE] Sertifika kaydı açılamadı:", insertError.message);
          failed += 1;
          continue;
        }
      }

      const rendered = certificateEmail({
        fullName: attendee.full_name,
        eventTitle,
        code,
        verifyUrl,
      });
      const result = await sendUserEmail({
        to: attendee.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        template: "certificate",
        attachments: [
          {
            filename: "nexrise-katilim-sertifikasi.pdf",
            content: Buffer.from(pdfBytes),
            contentType: "application/pdf",
          },
        ],
        relatedEventId: targetType === "event" ? targetId : null,
        relatedWebinarId: targetType === "webinar" ? targetId : null,
      });

      if (result.ok) {
        sent += 1;
      } else {
        failed += 1;
      }
    } catch (error) {
      console.error(
        "[NEXRISE] Sertifika üretimi başarısız:",
        error instanceof Error ? error.message : error
      );
      failed += 1;
    }

    // SMTP limitlerini zorlamamak için gönderimler arasında bekleme
    await wait(SEND_DELAY_MS);
  }

  const base =
    targetType === "event" ? "/admin/events" : "/admin/webinars";
  revalidatePath(`${base}/${targetId}/registrations`);

  if (failed > 0) {
    return {
      success: false,
      error: `${sent} sertifika gönderildi, ${skipped} zaten gönderilmişti, ${failed} başarısız. Tekrar çalıştırarak başarısızları yeniden deneyebilirsiniz.`,
    };
  }
  return { success: true };
}

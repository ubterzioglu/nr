import { brand } from "@/config/site";

export type UserEmailTemplate =
  | "registration-confirmation"
  | "registration-cancelled"
  | "reminder"
  | "certificate"
  | "thank-you"
  | "custom";

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Tüm kullanıcı maillerinin ortak marka çerçevesi. */
function emailLayout(title: string, bodyHtml: string): string {
  return `
  <div style="background:#f3f6fb;padding:32px 16px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e9f2">
      <div style="background:${brand.colors.dark};padding:24px 32px">
        <p style="margin:0;font-size:20px;font-weight:bold;color:#ffffff">NEX<span style="color:${brand.colors.accent}">RISE</span></p>
      </div>
      <div style="padding:32px">
        <h1 style="margin:0 0 16px;font-size:20px;color:#0f172a">${escapeHtml(title)}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px;border-top:1px solid #e5e9f2">
        <p style="margin:0;font-size:12px;color:#64748b">${escapeHtml(brand.name)} — ${escapeHtml(brand.slogan)}</p>
      </div>
    </div>
  </div>`.trim();
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;font-size:14px;color:#64748b;white-space:nowrap">${escapeHtml(label)}</td>
    <td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600">${escapeHtml(value)}</td>
  </tr>`;
}

function primaryButton(label: string, url: string): string {
  return `<a href="${escapeHtml(url)}" style="display:inline-block;background:${brand.colors.primary};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:10px">${escapeHtml(label)}</a>`;
}

export interface RegistrationEmailInput {
  fullName: string;
  eventTitle: string;
  dateLabel: string;
  timeLabel: string;
  location?: string;
  meetingUrl?: string;
  googleCalendarUrl: string;
  cancelUrl: string;
}

export function registrationConfirmationEmail(
  input: RegistrationEmailInput
): RenderedEmail {
  const subject = `Kaydınız alındı: ${input.eventTitle}`;

  const rows = [
    detailRow("Etkinlik", input.eventTitle),
    detailRow("Tarih", input.dateLabel),
    detailRow("Saat", `${input.timeLabel} (TRT)`),
    input.location ? detailRow("Konum", input.location) : "",
  ].join("");

  const meetingBlock = input.meetingUrl
    ? `<p style="margin:20px 0 8px;font-size:14px;color:#334155">Katılım bağlantınız:</p>
       <p style="margin:0 0 20px">${primaryButton("Etkinliğe Katıl", input.meetingUrl)}</p>`
    : "";

  const html = emailLayout(
    "Kaydınız Alındı 🎉",
    `<p style="margin:0 0 16px;font-size:14px;color:#334155">Merhaba ${escapeHtml(input.fullName)},</p>
     <p style="margin:0 0 20px;font-size:14px;color:#334155">Aşağıdaki etkinliğe kaydınız başarıyla oluşturuldu. Bu maili saklayın; katılım bilgileriniz burada.</p>
     <table style="border-collapse:collapse">${rows}</table>
     ${meetingBlock}
     <p style="margin:20px 0 8px;font-size:14px;color:#334155">Takviminize ekleyin (ekteki dosya Apple/Outlook için):</p>
     <p style="margin:0 0 24px"><a href="${escapeHtml(input.googleCalendarUrl)}" style="color:${brand.colors.primary};font-size:14px;font-weight:600">Google Takvime Ekle →</a></p>
     <p style="margin:0;font-size:12px;color:#94a3b8">Katılamayacak mısınız? <a href="${escapeHtml(input.cancelUrl)}" style="color:#94a3b8">Kaydınızı iptal edebilirsiniz</a>.</p>`
  );

  const text = [
    `Merhaba ${input.fullName},`,
    "",
    "Etkinlik kaydınız alındı:",
    `Etkinlik: ${input.eventTitle}`,
    `Tarih: ${input.dateLabel}`,
    `Saat: ${input.timeLabel} (TRT)`,
    input.location ? `Konum: ${input.location}` : "",
    input.meetingUrl ? `Katılım linki: ${input.meetingUrl}` : "",
    `Google Takvime ekle: ${input.googleCalendarUrl}`,
    `Kaydı iptal et: ${input.cancelUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

export function certificateEmail(input: {
  fullName: string;
  eventTitle: string;
  code: string;
  verifyUrl: string;
}): RenderedEmail {
  const subject = `Katılım sertifikanız hazır: ${input.eventTitle}`;
  const html = emailLayout(
    "Sertifikanız Hazır 🎓",
    `<p style="margin:0 0 16px;font-size:14px;color:#334155">Merhaba ${escapeHtml(input.fullName)},</p>
     <p style="margin:0 0 16px;font-size:14px;color:#334155">"${escapeHtml(input.eventTitle)}" etkinliğine katılımınız için teşekkür ederiz. Dijital katılım sertifikanız bu mailin ekindedir.</p>
     <table style="border-collapse:collapse">${detailRow("Doğrulama Kodu", input.code)}</table>
     <p style="margin:20px 0 0;font-size:14px;color:#334155">Sertifikanızın geçerliliği şu adresten kontrol edilebilir:</p>
     <p style="margin:8px 0 0"><a href="${escapeHtml(input.verifyUrl)}" style="color:${brand.colors.primary};font-size:14px;font-weight:600">${escapeHtml(input.verifyUrl)}</a></p>`
  );
  const text = [
    `Merhaba ${input.fullName},`,
    "",
    `"${input.eventTitle}" etkinliğine katılımınız için teşekkür ederiz.`,
    "Dijital katılım sertifikanız bu mailin ekindedir.",
    `Doğrulama kodu: ${input.code}`,
    `Doğrulama adresi: ${input.verifyUrl}`,
  ].join("\n");
  return { subject, html, text };
}

export function registrationCancelledEmail(input: {
  fullName: string;
  eventTitle: string;
}): RenderedEmail {
  const subject = `Kaydınız iptal edildi: ${input.eventTitle}`;
  const html = emailLayout(
    "Kaydınız İptal Edildi",
    `<p style="margin:0 0 16px;font-size:14px;color:#334155">Merhaba ${escapeHtml(input.fullName)},</p>
     <p style="margin:0;font-size:14px;color:#334155">"${escapeHtml(input.eventTitle)}" etkinliğine olan kaydınız iptal edildi. Fikriniz değişirse etkinlik sayfasından yeniden kayıt olabilirsiniz.</p>`
  );
  const text = `Merhaba ${input.fullName},\n\n"${input.eventTitle}" etkinliğine olan kaydınız iptal edildi. Fikriniz değişirse etkinlik sayfasından yeniden kayıt olabilirsiniz.`;
  return { subject, html, text };
}

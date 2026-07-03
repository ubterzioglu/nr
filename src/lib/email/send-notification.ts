import nodemailer from "nodemailer";

const DEFAULT_RECIPIENT = "kizilelmahamlesi@gmail.com";

type FormEmailPayload = {
  subject: string;
  fields: Record<string, string | undefined>;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml({ subject, fields }: FormEmailPayload): string {
  const rows = Object.entries(fields)
    .filter(([, value]) => value?.trim())
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:140px">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${escapeHtml(value ?? "")}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;max-width:640px">
      <h2 style="margin:0 0 16px;font-size:20px">${escapeHtml(subject)}</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table>
      <p style="margin-top:20px;font-size:12px;color:#6b7280">NEXRISE web sitesi form bildirimi</p>
    </div>
  `.trim();
}

export function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export async function sendFormNotification(payload: FormEmailPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return {
      ok: false,
      error:
        "E-posta ayarları eksik. Proje klasöründeki .env.local dosyasında SMTP_PASS (Gmail uygulama şifresi) tanımlayın, ardından sunucuyu yeniden başlatın.",
    };
  }

  const to = process.env.FORM_NOTIFICATION_EMAIL ?? DEFAULT_RECIPIENT;
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? DEFAULT_RECIPIENT;

  const text = Object.entries(payload.fields)
    .filter(([, value]) => value?.trim())
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  try {
    await transporter.sendMail({
      from: `NEXRISE Web <${from}>`,
      to,
      replyTo: payload.fields["E-posta"] ?? payload.fields["Eposta"],
      subject: payload.subject,
      text: `${payload.subject}\n\n${text}`,
      html: buildHtml(payload),
    });
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "E-posta gönderilemedi";
    console.error("[NEXRISE] Email send failed:", message);
    return { ok: false, error: message };
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

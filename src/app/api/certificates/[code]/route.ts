import { getCurrentUser } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/admin/session";
import { createServerClient } from "@/lib/supabase/client";
import { generateCertificatePdf } from "@/lib/certificates/generate";

/**
 * Sertifika PDF indirme: sertifika sahibinin kendisi (user_id veya e-posta
 * eşleşmesi) ya da admin indirebilir. Storage'da kopya yoksa PDF anlık
 * yeniden üretilir.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const normalized = decodeURIComponent(code).trim().toUpperCase();

  const supabase = createServerClient();
  if (!supabase) {
    return new Response("Veritabanı yapılandırılmamış", { status: 503 });
  }

  const { data: certificate } = await supabase
    .from("certificates")
    .select("registration_id, code, full_name, event_title, event_date, pdf_path")
    .eq("code", normalized)
    .maybeSingle();

  if (!certificate) {
    return new Response("Sertifika bulunamadı", { status: 404 });
  }

  // Yetki: sahibi veya admin
  const [currentUser, adminSession] = await Promise.all([
    getCurrentUser(),
    getAdminSession(),
  ]);

  let authorized = Boolean(adminSession);
  if (!authorized && currentUser) {
    const { data: registration } = await supabase
      .from("event_registrations")
      .select("user_id, email")
      .eq("id", certificate.registration_id)
      .maybeSingle();
    authorized = Boolean(
      registration &&
        (registration.user_id === currentUser.authUser.id ||
          registration.email.toLowerCase() ===
            (currentUser.authUser.email ?? "").toLowerCase())
    );
  }

  if (!authorized) {
    return new Response("Bu sertifikayı indirme yetkiniz yok", { status: 403 });
  }

  // Önce storage'daki kopya; yoksa anlık üretim
  let pdfBytes: Uint8Array | null = null;
  if (certificate.pdf_path) {
    const { data: file } = await supabase.storage
      .from("certificates")
      .download(certificate.pdf_path);
    if (file) pdfBytes = new Uint8Array(await file.arrayBuffer());
  }

  if (!pdfBytes) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const dateLabel = certificate.event_date
      ? new Date(`${certificate.event_date}T00:00:00`).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";
    pdfBytes = await generateCertificatePdf({
      fullName: certificate.full_name,
      eventTitle: certificate.event_title,
      dateLabel,
      code: certificate.code,
      verifyUrl: `${siteUrl}/sertifika-dogrula/${certificate.code}`,
    });
  }

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="nexrise-sertifika-${certificate.code}.pdf"`,
    },
  });
}

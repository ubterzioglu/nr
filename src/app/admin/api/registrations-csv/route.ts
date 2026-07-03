import { getAdminSession } from "@/lib/admin/session";
import { createServerClient } from "@/lib/supabase/client";

/**
 * Katılımcı listesi CSV dışa aktarımı.
 * BOM'lu UTF-8 + noktalı virgül ayracı: Türkçe Excel doğrudan açar.
 */
export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return new Response("Yetkisiz", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  if ((type !== "event" && type !== "webinar") || !id) {
    return new Response("Geçersiz istek", { status: 400 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return new Response("Veritabanı yapılandırılmamış", { status: 503 });
  }

  const targetColumn = type === "event" ? "event_id" : "webinar_id";
  const { data: registrations, error } = await supabase
    .from("event_registrations")
    .select("full_name, email, status, attended, created_at")
    .eq(targetColumn, id)
    .order("created_at", { ascending: true });

  if (error) {
    return new Response(`Sorgu hatası: ${error.message}`, { status: 500 });
  }

  const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const header = ["Ad Soyad", "E-posta", "Durum", "Katılım", "Kayıt Tarihi"];
  const lines = (registrations ?? []).map((row) =>
    [
      escapeCsv(row.full_name),
      escapeCsv(row.email),
      row.status === "registered" ? "Kayıtlı" : "İptal",
      row.attended === null ? "" : row.attended ? "Katıldı" : "Katılmadı",
      new Date(row.created_at).toLocaleString("tr-TR", {
        timeZone: "Europe/Istanbul",
      }),
    ].join(";")
  );

  const csv = "\uFEFF" + [header.join(";"), ...lines].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="katilimcilar-${type}-${id}.csv"`,
    },
  });
}

import { createServerClient } from "@/lib/supabase/client";

/**
 * Kontenjan durumu: aktif kayıt sayısı kapasiteye ulaştı mı?
 * Service role gerektirir (event_registrations PII); yapılandırma yoksa
 * kayıt formu açık kabul edilir — asıl kontrol kayıt action'ında yapılır.
 */
export async function isRegistrationFull(
  targetType: "event" | "webinar",
  dbId: string | null,
  capacity: number | null | undefined
): Promise<boolean> {
  if (!dbId || !capacity) return false;

  const supabase = createServerClient();
  if (!supabase) return false;

  const column = targetType === "event" ? "event_id" : "webinar_id";
  const { count, error } = await supabase
    .from("event_registrations")
    .select("id", { count: "exact", head: true })
    .eq(column, dbId)
    .eq("status", "registered");

  if (error) {
    console.error("[NEXRISE] kontenjan sorgusu başarısız:", error.message);
    return false;
  }

  return (count ?? 0) >= capacity;
}

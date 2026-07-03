import { createBrowserClient, createServerClient } from "@/lib/supabase/client";
import { webinars as fallbackWebinars } from "@/config/site";
import type { Database } from "@/types/database";
import type { Webinar } from "@/types";

type WebinarRow = Database["public"]["Tables"]["webinars"]["Row"];

function mapWebinarRow(row: WebinarRow): Webinar {
  const date = row.webinar_date ? new Date(row.webinar_date) : null;
  const isUpcoming = date ? date.getTime() > Date.now() : false;

  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    longDescription: row.description ?? "",
    date: row.webinar_date ?? "",
    time: date
      ? date.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Istanbul",
        })
      : "",
    duration: "",
    speaker: row.speaker ?? "",
    status: isUpcoming ? "upcoming" : "recorded",
    platform: "YouTube Live",
    topics: [],
    registrationOpen: isUpcoming,
  };
}

/**
 * Yayınlanmış webinarlar — Supabase yapılandırılmamışsa veya sorgu
 * başarısız olursa config verisine düşer; boş DB sonucu geçerli sonuçtur.
 */
export async function getPublishedWebinars(limit = 12): Promise<Webinar[]> {
  const supabase = createServerClient() ?? createBrowserClient();
  if (!supabase) return fallbackWebinars;

  const { data, error } = await supabase
    .from("webinars")
    .select("*")
    .eq("is_published", true)
    .order("webinar_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[NEXRISE] webinars sorgusu başarısız:", error.message);
    return fallbackWebinars;
  }

  return data.map(mapWebinarRow);
}

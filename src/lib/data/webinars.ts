import { createBrowserClient, createServerClient } from "@/lib/supabase/client";
import { webinars as fallbackWebinars } from "@/config/site";
import type { Database } from "@/types/database";
import type { Webinar } from "@/types";

type WebinarRow = Database["public"]["Views"]["webinars_public"]["Row"];

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
    capacity: row.capacity ?? undefined,
  };
}

/**
 * Yayınlanmış webinarlar — Supabase yapılandırılmamışsa veya sorgu
 * başarısız olursa config verisine düşer; boş DB sonucu geçerli sonuçtur.
 */
export async function getPublishedWebinars(limit = 12): Promise<Webinar[]> {
  const supabase = createServerClient() ?? createBrowserClient();
  if (!supabase) return fallbackWebinars;

  // webinars_public view'ı yalnızca yayınlanmış satırları ve public kolonları
  // içerir (meeting_url hariç) — anon key ile güvenli okuma yüzeyi.
  const { data, error } = await supabase
    .from("webinars_public")
    .select("*")
    .order("webinar_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[NEXRISE] webinars sorgusu başarısız:", error.message);
    return fallbackWebinars;
  }

  return data.map(mapWebinarRow);
}

export type WebinarDetail = {
  webinar: Webinar;
  /** DB kaydıysa satır id'si; config fallback'inde null. */
  dbId: string | null;
};

/**
 * Slug ile tek webinar — önce DB (public view), yoksa config fallback.
 */
export async function getWebinarBySlug(slug: string): Promise<WebinarDetail | null> {
  const fromConfig = () => {
    const fallback = fallbackWebinars.find((webinar) => webinar.slug === slug);
    return fallback ? { webinar: fallback, dbId: null } : null;
  };

  const supabase = createServerClient() ?? createBrowserClient();
  if (!supabase) return fromConfig();

  const { data, error } = await supabase
    .from("webinars_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[NEXRISE] webinar detay sorgusu başarısız:", error.message);
    return fromConfig();
  }

  if (data) return { webinar: mapWebinarRow(data), dbId: data.id };
  return fromConfig();
}

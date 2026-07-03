import { createBrowserClient, createServerClient } from "@/lib/supabase/client";
import { events as fallbackEvents } from "@/config/site";
import type { Database } from "@/types/database";
import type { Event } from "@/types";

type EventRow = Database["public"]["Views"]["events_public"]["Row"];

const eventTypes: readonly Event["type"][] = ["workshop", "summit", "networking", "conference"];

function mapEventRow(row: EventRow): Event {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    date: row.event_date ?? "",
    time: row.event_time?.slice(0, 5) ?? "",
    type: eventTypes.includes(row.event_type as Event["type"])
      ? (row.event_type as Event["type"])
      : "workshop",
    status: row.status === "past" ? "past" : "upcoming",
    speaker: row.speaker ?? undefined,
  };
}

/**
 * Yayınlanmış etkinlikler — Supabase yapılandırılmamışsa veya sorgu
 * başarısız olursa config verisine düşer; boş DB sonucu geçerli sonuçtur.
 */
export async function getPublishedEvents(limit = 12): Promise<Event[]> {
  const supabase = createServerClient() ?? createBrowserClient();
  if (!supabase) return fallbackEvents;

  // events_public view'ı yalnızca yayınlanmış satırları ve public kolonları
  // içerir (meeting_url hariç) — anon key ile güvenli okuma yüzeyi.
  const { data, error } = await supabase
    .from("events_public")
    .select("*")
    .order("event_date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[NEXRISE] events sorgusu başarısız:", error.message);
    return fallbackEvents;
  }

  // Tarihi olmayan kayıtlar listede gösterilmez
  return data.filter((row) => row.event_date).map(mapEventRow);
}

import { createBrowserClient, createServerClient } from "@/lib/supabase/client";
import { events as fallbackEvents } from "@/config/site";
import type { Database } from "@/types/database";
import type { Event } from "@/types";

type EventRow = Database["public"]["Views"]["events_public"]["Row"];

const eventTypes: readonly Event["type"][] = ["workshop", "summit", "networking", "conference"];

function mapEventRow(row: EventRow): Event {
  const status = row.status === "past" ? "past" : "upcoming";
  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    date: row.event_date ?? "",
    time: row.event_time?.slice(0, 5) ?? "",
    location: row.location ?? undefined,
    type: eventTypes.includes(row.event_type as Event["type"])
      ? (row.event_type as Event["type"])
      : "workshop",
    status,
    speaker: row.speaker ?? undefined,
    capacity: row.capacity ?? undefined,
    registrationOpen: status === "upcoming",
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

export type EventDetail = {
  event: Event;
  /** DB kaydıysa satır id'si; config fallback'inde null. */
  dbId: string | null;
};

/**
 * Slug ile tek etkinlik — önce DB (public view), yoksa config fallback.
 */
export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  const fromConfig = () => {
    const fallback = fallbackEvents.find((event) => event.slug === slug);
    return fallback ? { event: fallback, dbId: null } : null;
  };

  const supabase = createServerClient() ?? createBrowserClient();
  if (!supabase) return fromConfig();

  const { data, error } = await supabase
    .from("events_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[NEXRISE] etkinlik detay sorgusu başarısız:", error.message);
    return fromConfig();
  }

  if (data) return { event: mapEventRow(data), dbId: data.id };
  return fromConfig();
}

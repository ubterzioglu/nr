import { formatIcsDate } from "@/lib/email/ics";

export interface CalendarLinkInput {
  title: string;
  details?: string;
  location?: string;
  start: Date;
  durationMinutes?: number;
}

/** Tek tık "Google Takvime Ekle" bağlantısı üretir. */
export function googleCalendarUrl(input: CalendarLinkInput): string {
  const end = new Date(input.start.getTime() + (input.durationMinutes ?? 90) * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${formatIcsDate(input.start)}/${formatIcsDate(end)}`,
  });
  if (input.details) params.set("details", input.details);
  if (input.location) params.set("location", input.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

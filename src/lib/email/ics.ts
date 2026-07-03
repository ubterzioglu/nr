/**
 * Harici bağımlılık olmadan ICS (iCalendar) üretimi.
 * Apple Calendar ve Outlook e-postadaki .ics ekini doğrudan açar.
 */

export interface IcsEventInput {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  url?: string;
  start: Date;
  durationMinutes?: number;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Date → UTC "YYYYMMDDTHHMMSSZ" */
export function formatIcsDate(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function buildIcs(event: IcsEventInput): string {
  const start = event.start;
  const end = new Date(start.getTime() + (event.durationMinutes ?? 90) * 60_000);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NEXRISE//Etkinlik Takvimi//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ];

  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);
  if (event.url) lines.push(`URL:${escapeIcsText(event.url)}`);

  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

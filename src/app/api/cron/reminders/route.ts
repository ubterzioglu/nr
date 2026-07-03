import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/client";
import { genericEmail } from "@/lib/email/templates";
import { sendUserEmail } from "@/lib/email/send-user-email";

export const dynamic = "force-dynamic";

/**
 * Otomatik hatırlatma sistemi (content.pdf §7): etkinlikten 1 gün, 1 saat
 * ve 15 dakika önce kayıtlılara mail atar. Harici zamanlayıcı tarafından
 * ~5 dakikada bir çağrılır (Coolify scheduled task veya Supabase pg_cron
 * http çağrısı): GET /api/cron/reminders, Authorization: Bearer CRON_SECRET.
 *
 * Pencereler kesişmez (15dk / 15dk–1s / 1s–24s) ve damga yalnızca başarılı
 * gönderimde atılır — başarısızlar bir sonraki çalışmada yeniden denenir.
 */

type ReminderWindow = "1d" | "1h" | "15m";

type ReminderTarget = {
  type: "event" | "webinar";
  id: string;
  title: string;
  start: Date;
  location: string | null;
  meetingUrl: string | null;
};

const WINDOW_COLUMN: Record<ReminderWindow, "reminder_1d_sent_at" | "reminder_1h_sent_at" | "reminder_15m_sent_at"> = {
  "1d": "reminder_1d_sent_at",
  "1h": "reminder_1h_sent_at",
  "15m": "reminder_15m_sent_at",
};

const WINDOW_LABEL: Record<ReminderWindow, string> = {
  "1d": "yarın",
  "1h": "1 saat içinde",
  "15m": "15 dakika içinde",
};

function resolveWindow(deltaMs: number): ReminderWindow | null {
  const minutes = deltaMs / 60_000;
  if (minutes <= 0) return null;
  if (minutes <= 15) return "15m";
  if (minutes <= 60) return "1h";
  if (minutes <= 24 * 60) return "1d";
  return null;
}

function buildReminderBody(target: ReminderTarget, window: ReminderWindow): string {
  const dateLabel = target.start.toLocaleString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });

  const lines = [
    `Merhaba,`,
    ``,
    `Kayıt olduğunuz "${target.title}" etkinliği ${WINDOW_LABEL[window]} başlıyor.`,
    ``,
    `Tarih/Saat: ${dateLabel} (TRT)`,
  ];
  if (target.location) lines.push(`Konum: ${target.location}`);
  if (target.meetingUrl) {
    lines.push(``, `Katılım linki: ${target.meetingUrl}`);
  }
  lines.push(``, `Görüşmek üzere!`, `NEXRISE Ekibi`);
  return lines.join("\n");
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase yapılandırılmamış" }, { status: 503 });
  }

  const now = new Date();
  const horizon = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  const today = now.toISOString().slice(0, 10);
  const tomorrow = horizon.toISOString().slice(0, 10);

  // Önümüzdeki 25 saat içinde başlayacak yayınlanmış etkinlik/webinarlar
  const [{ data: events }, { data: webinars }] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, event_date, event_time, location, meeting_url")
      .eq("is_published", true)
      .gte("event_date", today)
      .lte("event_date", tomorrow),
    supabase
      .from("webinars")
      .select("id, title, webinar_date, meeting_url")
      .eq("is_published", true)
      .gte("webinar_date", now.toISOString())
      .lte("webinar_date", horizon.toISOString()),
  ]);

  const targets: ReminderTarget[] = [
    ...(events ?? [])
      .filter((event) => event.event_date)
      .map((event) => ({
        type: "event" as const,
        id: event.id,
        title: event.title,
        start: new Date(
          `${event.event_date}T${event.event_time?.slice(0, 5) ?? "09:00"}:00+03:00`
        ),
        location: event.location,
        meetingUrl: event.meeting_url,
      })),
    ...(webinars ?? [])
      .filter((webinar) => webinar.webinar_date)
      .map((webinar) => ({
        type: "webinar" as const,
        id: webinar.id,
        title: webinar.title,
        start: new Date(webinar.webinar_date as string),
        location: "Online",
        meetingUrl: webinar.meeting_url,
      })),
  ];

  let sent = 0;
  let failed = 0;

  for (const target of targets) {
    const window = resolveWindow(target.start.getTime() - now.getTime());
    if (!window) continue;

    const column = WINDOW_COLUMN[window];
    const targetColumn = target.type === "event" ? "event_id" : "webinar_id";

    const { data: registrations } = await supabase
      .from("event_registrations")
      .select("id, email, full_name")
      .eq(targetColumn, target.id)
      .eq("status", "registered")
      .is(column, null);

    if (!registrations || registrations.length === 0) continue;

    const body = buildReminderBody(target, window);
    const subject = `Hatırlatma: ${target.title} ${WINDOW_LABEL[window]} başlıyor`;

    for (const registration of registrations) {
      const rendered = genericEmail({ title: subject, bodyText: body });
      const result = await sendUserEmail({
        to: registration.email,
        subject,
        html: rendered.html,
        text: rendered.text,
        template: "reminder",
        relatedEventId: target.type === "event" ? target.id : null,
        relatedWebinarId: target.type === "webinar" ? target.id : null,
      });

      if (result.ok) {
        // Damga yalnızca başarılı gönderimde — başarısızlar sonraki
        // çalıştırmada yeniden denenir.
        const stampedAt = new Date().toISOString();
        const stamp =
          column === "reminder_1d_sent_at"
            ? { reminder_1d_sent_at: stampedAt }
            : column === "reminder_1h_sent_at"
              ? { reminder_1h_sent_at: stampedAt }
              : { reminder_15m_sent_at: stampedAt };
        await supabase
          .from("event_registrations")
          .update(stamp)
          .eq("id", registration.id);
        sent += 1;
      } else {
        failed += 1;
      }
    }
  }

  return NextResponse.json({ ok: true, sent, failed, checked: targets.length });
}

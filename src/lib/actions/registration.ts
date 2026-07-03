"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/server";
import { sendFormNotification } from "@/lib/email/send-notification";
import { sendUserEmail } from "@/lib/email/send-user-email";
import {
  registrationConfirmationEmail,
  registrationCancelledEmail,
} from "@/lib/email/templates";
import { buildIcs } from "@/lib/email/ics";
import { googleCalendarUrl } from "@/lib/email/calendar-links";
import { eventRegistrationSchema } from "@/lib/validations/forms";

type ActionResult = { success: true } | { success: false; error: string };

export type RegistrationTargetType = "event" | "webinar";

export interface RegistrationInput {
  targetType: RegistrationTargetType;
  slug: string;
  /** Misafir kaydında zorunlu; girişli tek tık kayıtta hesaptan alınır. */
  fullName?: string;
  email?: string;
  kvkkConsent?: boolean;
  /** Honeypot — insan kullanıcılar boş bırakır. */
  website?: string;
}

/** Etkinlik/webinar hedefinin mail ve kontenjan için ortak görünümü. */
type RegistrationTarget = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  meetingUrl: string | null;
  capacity: number | null;
  start: Date | null;
};

// Basit süreç içi rate limit: e-posta başına saatte en fazla 5 kayıt denemesi.
const attemptLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const attempts = (attemptLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  attempts.push(now);
  attemptLog.set(key, attempts);
  return attempts.length > RATE_LIMIT_MAX_ATTEMPTS;
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function eventStart(eventDate: string | null, eventTime: string | null): Date | null {
  if (!eventDate) return null;
  return new Date(`${eventDate}T${eventTime?.slice(0, 5) ?? "09:00"}:00+03:00`);
}

async function fetchTarget(
  supabase: NonNullable<ReturnType<typeof createServerClient>>,
  targetType: RegistrationTargetType,
  slug: string
): Promise<RegistrationTarget | null> {
  if (targetType === "event") {
    const { data } = await supabase
      .from("events")
      .select("id, title, description, location, meeting_url, capacity, event_date, event_time, is_published")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!data) return null;
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      location: data.location,
      meetingUrl: data.meeting_url,
      capacity: data.capacity,
      start: eventStart(data.event_date, data.event_time),
    };
  }

  const { data } = await supabase
    .from("webinars")
    .select("id, title, description, meeting_url, capacity, webinar_date, is_published")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    location: "Online",
    meetingUrl: data.meeting_url,
    capacity: data.capacity,
    start: data.webinar_date ? new Date(data.webinar_date) : null,
  };
}

async function isCapacityFull(
  supabase: NonNullable<ReturnType<typeof createServerClient>>,
  targetType: RegistrationTargetType,
  targetId: string,
  capacity: number | null
): Promise<boolean> {
  if (!capacity) return false;
  const column = targetType === "event" ? "event_id" : "webinar_id";
  const { count } = await supabase
    .from("event_registrations")
    .select("id", { count: "exact", head: true })
    .eq(column, targetId)
    .eq("status", "registered");
  return (count ?? 0) >= capacity;
}

async function sendConfirmation(params: {
  fullName: string;
  email: string;
  target: RegistrationTarget;
  targetType: RegistrationTargetType;
  cancelToken: string;
}) {
  const { fullName, email, target, targetType, cancelToken } = params;
  const start = target.start ?? new Date();
  const dateLabel = start.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  });
  const timeLabel = start.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
  const cancelUrl = `${siteUrl()}/kayit-iptal/${cancelToken}`;
  const calendarUrl = googleCalendarUrl({
    title: `${target.title} — NEXRISE`,
    details: target.meetingUrl ?? target.description ?? undefined,
    location: target.location ?? undefined,
    start,
  });

  const rendered = registrationConfirmationEmail({
    fullName,
    eventTitle: target.title,
    dateLabel,
    timeLabel,
    location: target.location ?? undefined,
    meetingUrl: target.meetingUrl ?? undefined,
    googleCalendarUrl: calendarUrl,
    cancelUrl,
  });

  const ics = buildIcs({
    uid: `${cancelToken}@nexrise`,
    title: `${target.title} — NEXRISE`,
    description: target.meetingUrl ?? target.description ?? undefined,
    location: target.location ?? undefined,
    url: target.meetingUrl ?? undefined,
    start,
  });

  await sendUserEmail({
    to: email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    template: "registration-confirmation",
    attachments: [
      { filename: "etkinlik.ics", content: ics, contentType: "text/calendar; charset=utf-8" },
    ],
    relatedEventId: targetType === "event" ? target.id : null,
    relatedWebinarId: targetType === "webinar" ? target.id : null,
  });
}

/**
 * Etkinlik/webinar kaydı: misafir (form) veya girişli üye (tek tık).
 * Supabase yapılandırılmamışsa eski davranışa döner: yalnızca admin'e
 * bildirim maili gönderilir.
 */
export async function submitEventRegistration(
  input: RegistrationInput
): Promise<ActionResult> {
  // Honeypot dolduysa bot varsayılır; sessizce başarı döndürülür.
  if (input.website) {
    return { success: true };
  }

  const currentUser = await getCurrentUser();

  let fullName: string;
  let email: string;
  let kvkkConsentAt: string | null;

  if (currentUser) {
    // Tek tık kayıt: bilgiler hesaptan alınır; üyelik KVKK onayı geçerlidir.
    fullName =
      currentUser.profile?.full_name ??
      input.fullName ??
      currentUser.authUser.email ??
      "";
    email = currentUser.authUser.email ?? "";
    kvkkConsentAt =
      currentUser.profile?.kvkk_consent_at ??
      (input.kvkkConsent ? new Date().toISOString() : null);
    if (!kvkkConsentAt) {
      return { success: false, error: "KVKK onayı gerekli." };
    }
  } else {
    const parsed = eventRegistrationSchema.safeParse({
      fullName: input.fullName ?? "",
      email: input.email ?? "",
      kvkkConsent: input.kvkkConsent ?? false,
      website: input.website ?? "",
    });
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
    }
    fullName = parsed.data.fullName;
    email = parsed.data.email;
    kvkkConsentAt = new Date().toISOString();
  }

  if (isRateLimited(`${email}:${input.slug}`)) {
    return {
      success: false,
      error: "Çok fazla deneme yapıldı. Lütfen bir süre sonra tekrar deneyin.",
    };
  }

  const supabase = createServerClient();

  // Supabase yoksa eski e-posta-only davranış korunur.
  if (!supabase) {
    const emailResult = await sendFormNotification({
      subject: "NEXRISE — Yeni Etkinlik Kaydı",
      fields: {
        Etkinlik: input.slug,
        "Ad Soyad": fullName,
        "E-posta": email,
      },
    });
    if (!emailResult.ok) {
      return { success: false, error: emailResult.error };
    }
    return { success: true };
  }

  const target = await fetchTarget(supabase, input.targetType, input.slug);
  if (!target) {
    return { success: false, error: "Etkinlik bulunamadı veya yayında değil." };
  }

  if (await isCapacityFull(supabase, input.targetType, target.id, target.capacity)) {
    return { success: false, error: "Üzgünüz, bu etkinliğin kontenjanı doldu." };
  }

  const { data: registration, error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: input.targetType === "event" ? target.id : null,
      webinar_id: input.targetType === "webinar" ? target.id : null,
      user_id: currentUser?.authUser.id ?? null,
      full_name: fullName,
      email: email.toLowerCase(),
      kvkk_consent_at: kvkkConsentAt,
    })
    .select("cancel_token")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Bu e-posta adresiyle zaten kayıtlısınız." };
    }
    return { success: false, error: "Kayıt oluşturulamadı. Lütfen tekrar deneyin." };
  }

  // Katılımcıya onay maili (ICS + takvim linki + iptal linki).
  // Mail hatası kaydı geçersiz kılmaz; email_log'a işlenir.
  await sendConfirmation({
    fullName,
    email,
    target,
    targetType: input.targetType,
    cancelToken: registration.cancel_token,
  });

  // Admin bildirimi best-effort.
  await sendFormNotification({
    subject: "NEXRISE — Yeni Etkinlik Kaydı",
    fields: {
      Etkinlik: target.title,
      "Ad Soyad": fullName,
      "E-posta": email,
    },
  });

  return { success: true };
}

/** Onay mailindeki bağlantıyla kayıt iptali; kontenjan geri açılır. */
export async function cancelRegistration(token: string): Promise<
  | { success: true; eventTitle: string }
  | { success: false; error: string }
> {
  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "İptal işlemi şu anda yapılamıyor." };
  }

  const { data: registration } = await supabase
    .from("event_registrations")
    .select("id, full_name, email, status, event_id, webinar_id")
    .eq("cancel_token", token)
    .maybeSingle();

  if (!registration) {
    return { success: false, error: "Geçersiz veya kullanılmış iptal bağlantısı." };
  }

  let eventTitle = "Etkinlik";
  if (registration.event_id) {
    const { data } = await supabase
      .from("events")
      .select("title")
      .eq("id", registration.event_id)
      .maybeSingle();
    if (data) eventTitle = data.title;
  } else if (registration.webinar_id) {
    const { data } = await supabase
      .from("webinars")
      .select("title")
      .eq("id", registration.webinar_id)
      .maybeSingle();
    if (data) eventTitle = data.title;
  }

  if (registration.status === "cancelled") {
    return { success: true, eventTitle };
  }

  const { error } = await supabase
    .from("event_registrations")
    .update({ status: "cancelled" })
    .eq("id", registration.id);

  if (error) {
    return { success: false, error: "İptal işlemi başarısız oldu. Lütfen tekrar deneyin." };
  }

  const rendered = registrationCancelledEmail({
    fullName: registration.full_name,
    eventTitle,
  });
  await sendUserEmail({
    to: registration.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    template: "registration-cancelled",
    relatedEventId: registration.event_id,
    relatedWebinarId: registration.webinar_id,
  });

  revalidatePath("/etkinlikler");
  revalidatePath("/webinarlar");

  return { success: true, eventTitle };
}

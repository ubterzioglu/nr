"use server";

import { createServerClient } from "@/lib/supabase/client";
import { sendFormNotification } from "@/lib/email/send-notification";
import { applicationTypeLabels } from "@/config/site";
import {
  applicationSchema,
  contactSchema,
  sponsorInquirySchema,
  type ContactFormData,
  type ApplicationFormData,
  type SponsorInquiryFormData,
} from "@/lib/validations/forms";

type ActionResult = { success: true } | { success: false; error: string };

export async function submitContact(data: ContactFormData): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Geçersiz form verisi." };
  }

  const emailResult = await sendFormNotification({
    subject: "NEXRISE — Yeni İletişim Mesajı",
    fields: {
      "Ad Soyad": parsed.data.fullName,
      "E-posta": parsed.data.email,
      Şehir: parsed.data.city,
      Mesaj: parsed.data.message,
    },
  });

  if (!emailResult.ok) {
    return { success: false, error: emailResult.error };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: true };
  }

  const { error } = await supabase.from("contacts").insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    city: parsed.data.city || null,
    message: parsed.data.message,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function submitApplication(data: ApplicationFormData): Promise<ActionResult> {
  const parsed = applicationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Geçersiz form verisi." };
  }

  const typeLabel = applicationTypeLabels[parsed.data.type];

  const emailResult = await sendFormNotification({
    subject: `NEXRISE — Yeni Başvuru (${typeLabel})`,
    fields: {
      "Başvuru Türü": typeLabel,
      "Ad Soyad": parsed.data.fullName,
      "E-posta": parsed.data.email,
      Şehir: parsed.data.city,
      Mesaj: parsed.data.message,
    },
  });

  if (!emailResult.ok) {
    return { success: false, error: emailResult.error };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: true };
  }

  const { error } = await supabase.from("applications").insert({
    type: parsed.data.type,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    city: parsed.data.city || null,
    message: parsed.data.message,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function submitSponsorInquiry(data: SponsorInquiryFormData): Promise<ActionResult> {
  const parsed = sponsorInquirySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Geçersiz form verisi." };
  }

  const emailResult = await sendFormNotification({
    subject: "NEXRISE — Yeni Sponsor / İş Birliği Başvurusu",
    fields: {
      Şirket: parsed.data.company,
      Yetkili: parsed.data.contact,
      "E-posta": parsed.data.email,
      Mesaj: parsed.data.message,
    },
  });

  if (!emailResult.ok) {
    return { success: false, error: emailResult.error };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: true };
  }

  const { error } = await supabase.from("applications").insert({
    type: "sponsor",
    full_name: parsed.data.contact,
    email: parsed.data.email,
    message: `[${parsed.data.company}] ${parsed.data.message}`,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function submitEventRegistration(data: {
  eventSlug: string;
  fullName: string;
  email: string;
}): Promise<ActionResult> {
  const emailResult = await sendFormNotification({
    subject: "NEXRISE — Yeni Etkinlik Kaydı",
    fields: {
      Etkinlik: data.eventSlug,
      "Ad Soyad": data.fullName,
      "E-posta": data.email,
    },
  });

  if (!emailResult.ok) {
    return { success: false, error: emailResult.error };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: true };
  }

  const { error } = await supabase.from("applications").insert({
    type: "event",
    full_name: data.fullName,
    email: data.email,
    message: `Etkinlik kaydı: ${data.eventSlug}`,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

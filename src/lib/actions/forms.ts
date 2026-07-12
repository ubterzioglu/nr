"use server";

import { createServerClient } from "@/lib/supabase/client";
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

  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "Üyelik sistemi yapılandırılmamış." };
  }

  const { error } = await supabase.from("contacts").insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    city: parsed.data.city || null,
    message: parsed.data.message,
    kvkk_consent_at: new Date().toISOString(),
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function submitApplication(data: ApplicationFormData): Promise<ActionResult> {
  const parsed = applicationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Geçersiz form verisi." };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "Üyelik sistemi yapılandırılmamış." };
  }

  const { error } = await supabase.from("applications").insert({
    type: parsed.data.type,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    city: parsed.data.city || null,
    message: parsed.data.message,
    kvkk_consent_at: new Date().toISOString(),
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function submitSponsorInquiry(data: SponsorInquiryFormData): Promise<ActionResult> {
  const parsed = sponsorInquirySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Geçersiz form verisi." };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return { success: false, error: "Üyelik sistemi yapılandırılmamış." };
  }

  const { error } = await supabase.from("applications").insert({
    type: "sponsor",
    full_name: parsed.data.contact,
    email: parsed.data.email,
    message: `[${parsed.data.company}] ${parsed.data.message}`,
    kvkk_consent_at: new Date().toISOString(),
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Etkinlik/webinar kayıtları artık src/lib/actions/registration.ts'te:
// kontenjan kontrolü, çift kayıt engeli, iptal linki ve katılımcıya
// onay maili (ICS ekli) ile birlikte event_registrations tablosuna yazar.

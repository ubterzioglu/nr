import { z } from "zod";

/** PII toplayan tüm formlarda zorunlu KVKK açık rıza alanı. */
export const kvkkConsentField = z
  .boolean()
  .refine((value) => value === true, "KVKK aydınlatma metnini onaylamanız gerekir");

export const contactSchema = z.object({
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  city: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
  kvkkConsent: kvkkConsentField,
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  type: z.enum(["management", "volunteer", "presidency", "speaker", "sponsor", "partner"]),
  city: z.string().optional(),
  message: z.string().min(20, "Mesaj en az 20 karakter olmalıdır"),
  kvkkConsent: kvkkConsentField,
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const sponsorInquirySchema = z.object({
  company: z.string().min(2, "Şirket adı gerekli"),
  contact: z.string().min(2, "Yetkili adı gerekli"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  message: z.string().min(20, "Mesaj en az 20 karakter olmalıdır"),
  kvkkConsent: kvkkConsentField,
});

export type SponsorInquiryFormData = z.infer<typeof sponsorInquirySchema>;

/** Misafir etkinlik/webinar kayıt formu. `website` alanı honeypot'tur. */
export const eventRegistrationSchema = z.object({
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  kvkkConsent: kvkkConsentField,
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EventRegistrationFormData = z.infer<typeof eventRegistrationSchema>;

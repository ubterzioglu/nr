import { z } from "zod";

const optionalUrl = z
  .string()
  .url("Geçerli bir bağlantı girin")
  .optional()
  .or(z.literal(""));

export const adminEventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  slug: z
    .string()
    .min(3, "Slug en az 3 karakter olmalıdır")
    .regex(/^[a-z0-9-]+$/, "Yalnızca küçük harf, rakam ve tire kullanın"),
  description: z.string().optional(),
  eventType: z.enum(["workshop", "summit", "networking", "conference"]),
  status: z.enum(["upcoming", "past"]),
  eventDate: z.string().min(1, "Tarih gerekli"),
  eventTime: z.string().optional(),
  speaker: z.string().optional(),
  location: z.string().optional(),
  // RHF + zodResolver tip uyumu için form katmanında string tutulur;
  // server action DB'ye yazarken sayıya çevirir.
  capacity: z
    .string()
    .optional()
    .refine(
      (value) => !value || (/^\d+$/.test(value) && Number(value) >= 1),
      "Kontenjan 1 veya daha büyük bir tam sayı olmalıdır"
    ),
  meetingUrl: optionalUrl,
  registrationUrl: optionalUrl,
  isPublished: z.boolean(),
});

export type AdminEventFormData = z.infer<typeof adminEventSchema>;

export const adminWebinarSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  slug: z
    .string()
    .min(3, "Slug en az 3 karakter olmalıdır")
    .regex(/^[a-z0-9-]+$/, "Yalnızca küçük harf, rakam ve tire kullanın"),
  description: z.string().optional(),
  speaker: z.string().optional(),
  webinarDate: z.string().min(1, "Tarih gerekli"),
  webinarTime: z.string().min(1, "Saat gerekli"),
  // RHF + zodResolver tip uyumu için form katmanında string tutulur;
  // server action DB'ye yazarken sayıya çevirir.
  capacity: z
    .string()
    .optional()
    .refine(
      (value) => !value || (/^\d+$/.test(value) && Number(value) >= 1),
      "Kontenjan 1 veya daha büyük bir tam sayı olmalıdır"
    ),
  meetingUrl: optionalUrl,
  recordingUrl: optionalUrl,
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
});

export type AdminWebinarFormData = z.infer<typeof adminWebinarSchema>;

export const eventTypeLabels: Record<AdminEventFormData["eventType"], string> = {
  workshop: "Atölye",
  summit: "Zirve",
  networking: "Networking",
  conference: "Konferans",
};

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { slugify } from "@/lib/utils";
import { saveEvent } from "@/lib/actions/admin/events";
import {
  adminEventSchema,
  eventTypeLabels,
  type AdminEventFormData,
} from "@/lib/validations/admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface EventFormInitialValues extends Partial<AdminEventFormData> {
  imageUrl?: string | null;
}

interface EventFormProps {
  initialValues?: EventFormInitialValues;
}

const selectClassName =
  "flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm";

export function EventForm({ initialValues }: EventFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialValues?.id);
  const [serverError, setServerError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.imageUrl ?? null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [slugTouched, setSlugTouched] = useState(isEdit);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminEventFormData>({
    resolver: zodResolver(adminEventSchema),
    defaultValues: {
      id: initialValues?.id,
      title: initialValues?.title ?? "",
      slug: initialValues?.slug ?? "",
      description: initialValues?.description ?? "",
      eventType: initialValues?.eventType ?? "workshop",
      status: initialValues?.status ?? "upcoming",
      eventDate: initialValues?.eventDate ?? "",
      eventTime: initialValues?.eventTime ?? "",
      speaker: initialValues?.speaker ?? "",
      location: initialValues?.location ?? "",
      capacity: initialValues?.capacity ?? "",
      meetingUrl: initialValues?.meetingUrl ?? "",
      registrationUrl: initialValues?.registrationUrl ?? "",
      isPublished: initialValues?.isPublished ?? false,
    },
  });

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) {
      setValue("slug", slugify(event.target.value));
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    setImagePreview(
      file ? URL.createObjectURL(file) : initialValues?.imageUrl ?? null
    );
  }

  async function onSubmit(data: AdminEventFormData) {
    setServerError(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.set(key, String(value));
      }
    });
    if (imageFile) formData.set("image", imageFile);

    const result = await saveEvent(formData);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    router.push("/admin/events");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="event-title" className="mb-1.5 block text-sm font-medium">
                Başlık *
              </label>
              <Input
                id="event-title"
                {...register("title", { onChange: handleTitleChange })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-brand-error">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="event-slug" className="mb-1.5 block text-sm font-medium">
                Slug (URL) *
              </label>
              <Input
                id="event-slug"
                {...register("slug", {
                  onChange: () => setSlugTouched(true),
                })}
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-brand-error">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="event-description" className="mb-1.5 block text-sm font-medium">
              Açıklama
            </label>
            <Textarea id="event-description" rows={4} {...register("description")} />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="event-type" className="mb-1.5 block text-sm font-medium">
                Tür *
              </label>
              <select id="event-type" className={selectClassName} {...register("eventType")}>
                {Object.entries(eventTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="event-date" className="mb-1.5 block text-sm font-medium">
                Tarih *
              </label>
              <Input id="event-date" type="date" {...register("eventDate")} />
              {errors.eventDate && (
                <p className="mt-1 text-sm text-brand-error">{errors.eventDate.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="event-time" className="mb-1.5 block text-sm font-medium">
                Saat
              </label>
              <Input id="event-time" type="time" {...register("eventTime")} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="event-speaker" className="mb-1.5 block text-sm font-medium">
                Konuşmacı
              </label>
              <Input id="event-speaker" {...register("speaker")} />
            </div>
            <div>
              <label htmlFor="event-location" className="mb-1.5 block text-sm font-medium">
                Konum
              </label>
              <Input id="event-location" placeholder="Örn. İstanbul / Online" {...register("location")} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="event-capacity" className="mb-1.5 block text-sm font-medium">
                Kontenjan
              </label>
              <Input
                id="event-capacity"
                type="number"
                min={1}
                placeholder="Boş bırakılırsa sınırsız"
                {...register("capacity")}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-brand-error">{errors.capacity.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="event-meeting" className="mb-1.5 block text-sm font-medium">
                Katılım Linki (Meet/Zoom/Teams)
              </label>
              <Input
                id="event-meeting"
                type="url"
                placeholder="https://…"
                {...register("meetingUrl")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Bu link sitede gösterilmez; yalnızca kayıt olan katılımcılara
                e-posta ile gönderilir.
              </p>
              {errors.meetingUrl && (
                <p className="mt-1 text-sm text-brand-error">{errors.meetingUrl.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="event-image" className="mb-1.5 block text-sm font-medium">
              Kapak Görseli (JPG/PNG/WebP, en fazla 4 MB)
            </label>
            <input
              id="event-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-brand-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-primary"
            />
            {imagePreview && (
              <div className="relative mt-3 h-36 w-64 overflow-hidden rounded-xl border border-border">
                <Image
                  src={imagePreview}
                  alt="Kapak görseli önizleme"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="event-status" className="mb-1.5 block text-sm font-medium">
                Durum
              </label>
              <select id="event-status" className={selectClassName} {...register("status")}>
                <option value="upcoming">Yaklaşan</option>
                <option value="past">Geçmiş</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2.5 text-sm font-medium">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border accent-brand-primary"
                  {...register("isPublished")}
                />
                Sitede yayınla
              </label>
            </div>
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-brand-error">
              {serverError}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : isEdit ? "Değişiklikleri Kaydet" : "Etkinlik Oluştur"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/admin/events")}
            >
              Vazgeç
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

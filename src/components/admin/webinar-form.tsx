"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { slugify } from "@/lib/utils";
import { saveWebinar } from "@/lib/actions/admin/webinars";
import { adminWebinarSchema, type AdminWebinarFormData } from "@/lib/validations/admin";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface WebinarFormInitialValues extends Partial<AdminWebinarFormData> {
  imageUrl?: string | null;
}

interface WebinarFormProps {
  initialValues?: WebinarFormInitialValues;
}

export function WebinarForm({ initialValues }: WebinarFormProps) {
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
  } = useForm<AdminWebinarFormData>({
    resolver: zodResolver(adminWebinarSchema),
    defaultValues: {
      id: initialValues?.id,
      title: initialValues?.title ?? "",
      slug: initialValues?.slug ?? "",
      description: initialValues?.description ?? "",
      speaker: initialValues?.speaker ?? "",
      webinarDate: initialValues?.webinarDate ?? "",
      webinarTime: initialValues?.webinarTime ?? "",
      capacity: initialValues?.capacity ?? "",
      meetingUrl: initialValues?.meetingUrl ?? "",
      recordingUrl: initialValues?.recordingUrl ?? "",
      isFeatured: initialValues?.isFeatured ?? false,
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

  async function onSubmit(data: AdminWebinarFormData) {
    setServerError(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.set(key, String(value));
      }
    });
    if (imageFile) formData.set("image", imageFile);

    const result = await saveWebinar(formData);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    router.push("/admin/webinars");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="webinar-title" className="mb-1.5 block text-sm font-medium">
                Başlık *
              </label>
              <Input
                id="webinar-title"
                {...register("title", { onChange: handleTitleChange })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-brand-error">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="webinar-slug" className="mb-1.5 block text-sm font-medium">
                Slug (URL) *
              </label>
              <Input
                id="webinar-slug"
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
            <label
              htmlFor="webinar-description"
              className="mb-1.5 block text-sm font-medium"
            >
              Açıklama
            </label>
            <Textarea id="webinar-description" rows={4} {...register("description")} />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="webinar-speaker" className="mb-1.5 block text-sm font-medium">
                Konuşmacı
              </label>
              <Input id="webinar-speaker" {...register("speaker")} />
            </div>
            <div>
              <label htmlFor="webinar-date" className="mb-1.5 block text-sm font-medium">
                Tarih *
              </label>
              <Input id="webinar-date" type="date" {...register("webinarDate")} />
              {errors.webinarDate && (
                <p className="mt-1 text-sm text-brand-error">
                  {errors.webinarDate.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="webinar-time" className="mb-1.5 block text-sm font-medium">
                Saat *
              </label>
              <Input id="webinar-time" type="time" {...register("webinarTime")} />
              {errors.webinarTime && (
                <p className="mt-1 text-sm text-brand-error">
                  {errors.webinarTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="webinar-capacity" className="mb-1.5 block text-sm font-medium">
                Kontenjan
              </label>
              <Input
                id="webinar-capacity"
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
              <label htmlFor="webinar-meeting" className="mb-1.5 block text-sm font-medium">
                Katılım Linki (Meet/Zoom/Teams)
              </label>
              <Input
                id="webinar-meeting"
                type="url"
                placeholder="https://…"
                {...register("meetingUrl")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Bu link sitede gösterilmez; yalnızca kayıt olan katılımcılara
                e-posta ile gönderilir.
              </p>
              {errors.meetingUrl && (
                <p className="mt-1 text-sm text-brand-error">
                  {errors.meetingUrl.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="webinar-recording" className="mb-1.5 block text-sm font-medium">
              Kayıt (Video) Linki
            </label>
            <Input
              id="webinar-recording"
              type="url"
              placeholder="Webinar sonrası YouTube vb. kayıt bağlantısı"
              {...register("recordingUrl")}
            />
            {errors.recordingUrl && (
              <p className="mt-1 text-sm text-brand-error">
                {errors.recordingUrl.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="webinar-image" className="mb-1.5 block text-sm font-medium">
              Kapak Görseli (JPG/PNG/WebP, en fazla 4 MB)
            </label>
            <input
              id="webinar-image"
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

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2.5 text-sm font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border accent-brand-primary"
                {...register("isFeatured")}
              />
              Öne çıkan webinar
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border accent-brand-primary"
                {...register("isPublished")}
              />
              Sitede yayınla
            </label>
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-brand-error">
              {serverError}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Kaydediliyor..."
                : isEdit
                  ? "Değişiklikleri Kaydet"
                  : "Webinar Oluştur"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/admin/webinars")}
            >
              Vazgeç
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

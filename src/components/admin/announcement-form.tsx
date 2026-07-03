"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  saveAnnouncement,
  type AdminAnnouncementInput,
} from "@/lib/actions/admin/announcements";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const announcementFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  content: z.string().min(5, "İçerik en az 5 karakter olmalıdır"),
  link: z.string().url("Geçerli bir bağlantı girin").optional().or(z.literal("")),
  isPublished: z.boolean(),
});

interface AnnouncementFormProps {
  initialValues?: Partial<AdminAnnouncementInput>;
}

export function AnnouncementForm({ initialValues }: AnnouncementFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialValues?.id);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminAnnouncementInput>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      id: initialValues?.id,
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
      link: initialValues?.link ?? "",
      isPublished: initialValues?.isPublished ?? false,
    },
  });

  async function onSubmit(data: AdminAnnouncementInput) {
    setServerError(null);
    const result = await saveAnnouncement(data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    router.push("/admin/announcements");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="ann-title" className="mb-1.5 block text-sm font-medium">
              Başlık *
            </label>
            <Input id="ann-title" {...register("title")} />
            {errors.title && (
              <p className="mt-1 text-sm text-brand-error">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ann-content" className="mb-1.5 block text-sm font-medium">
              İçerik *
            </label>
            <Textarea id="ann-content" rows={4} {...register("content")} />
            {errors.content && (
              <p className="mt-1 text-sm text-brand-error">{errors.content.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ann-link" className="mb-1.5 block text-sm font-medium">
              Bağlantı (opsiyonel)
            </label>
            <Input id="ann-link" type="url" placeholder="https://…" {...register("link")} />
            {errors.link && (
              <p className="mt-1 text-sm text-brand-error">{errors.link.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-brand-primary"
              {...register("isPublished")}
            />
            Yayınla
          </label>

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
                  : "Duyuru Oluştur"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/admin/announcements")}
            >
              Vazgeç
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { saveBlogPost, type AdminBlogInput } from "@/lib/actions/admin/blogs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Form doğrulaması action'daki şemayla aynı kurallara sahiptir;
// server action her durumda yeniden doğrular.
const blogFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  slug: z
    .string()
    .min(3, "Slug en az 3 karakter olmalıdır")
    .regex(/^[a-z0-9-]+$/, "Yalnızca küçük harf, rakam ve tire kullanın"),
  category: z.enum(["Blog", "Haber", "Duyuru"]),
  excerpt: z.string().optional(),
  content: z.string().min(10, "İçerik en az 10 karakter olmalıdır"),
  tags: z.string().optional(),
  isPublished: z.boolean(),
});

const selectClassName =
  "flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm";

interface BlogFormProps {
  initialValues?: Partial<AdminBlogInput>;
}

export function BlogForm({ initialValues }: BlogFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialValues?.id);
  const [serverError, setServerError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(isEdit);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminBlogInput>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      id: initialValues?.id,
      title: initialValues?.title ?? "",
      slug: initialValues?.slug ?? "",
      category: initialValues?.category ?? "Blog",
      excerpt: initialValues?.excerpt ?? "",
      content: initialValues?.content ?? "",
      tags: initialValues?.tags ?? "",
      isPublished: initialValues?.isPublished ?? false,
    },
  });

  async function onSubmit(data: AdminBlogInput) {
    setServerError(null);
    const result = await saveBlogPost(data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="blog-title" className="mb-1.5 block text-sm font-medium">
                Başlık *
              </label>
              <Input
                id="blog-title"
                {...register("title", {
                  onChange: (event) => {
                    if (!slugTouched) setValue("slug", slugify(event.target.value));
                  },
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-brand-error">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="blog-slug" className="mb-1.5 block text-sm font-medium">
                Slug (URL) *
              </label>
              <Input
                id="blog-slug"
                {...register("slug", { onChange: () => setSlugTouched(true) })}
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-brand-error">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="blog-category" className="mb-1.5 block text-sm font-medium">
                Kategori *
              </label>
              <select id="blog-category" className={selectClassName} {...register("category")}>
                <option value="Blog">Blog Yazısı</option>
                <option value="Haber">Haber</option>
                <option value="Duyuru">Duyuru</option>
              </select>
            </div>
            <div>
              <label htmlFor="blog-tags" className="mb-1.5 block text-sm font-medium">
                Etiketler
              </label>
              <Input
                id="blog-tags"
                placeholder="Virgülle ayırın: Yapay Zekâ, Kariyer"
                {...register("tags")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="blog-excerpt" className="mb-1.5 block text-sm font-medium">
              Özet
            </label>
            <Textarea
              id="blog-excerpt"
              rows={2}
              placeholder="Listelerde ve arama motorlarında görünen kısa özet"
              {...register("excerpt")}
            />
          </div>

          <div>
            <label htmlFor="blog-content" className="mb-1.5 block text-sm font-medium">
              İçerik *
            </label>
            <Textarea
              id="blog-content"
              rows={14}
              placeholder="Düz metin yazın; boş satırlar paragraf olur."
              {...register("content")}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-brand-error">{errors.content.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-brand-primary"
              {...register("isPublished")}
            />
            Sitede yayınla
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
                  : "Yazı Oluştur"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/admin/blog")}
            >
              Vazgeç
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

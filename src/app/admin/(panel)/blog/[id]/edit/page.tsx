import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/client";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export default async function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  const category = ["Blog", "Haber", "Duyuru"].includes(post.category ?? "")
    ? (post.category as "Blog" | "Haber" | "Duyuru")
    : "Blog";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Yazıyı Düzenle</h1>
      <BlogForm
        initialValues={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          category,
          excerpt: post.excerpt ?? "",
          content: post.content ?? "",
          tags: Array.isArray(post.tags) ? (post.tags as string[]).join(", ") : "",
          isPublished: post.is_published,
        }}
      />
    </div>
  );
}

import { BlogForm } from "@/components/admin/blog-form";

export default function AdminNewBlogPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Yeni Yazı</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Blog yazısı, haber veya duyuru oluşturun; &quot;Sitede yayınla&quot;
        işaretlenmedikçe sitede görünmez.
      </p>
      <BlogForm />
    </div>
  );
}

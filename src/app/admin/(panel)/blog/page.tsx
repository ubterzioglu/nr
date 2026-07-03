import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { deleteBlogPost, toggleBlogPublished } from "@/lib/actions/admin/blogs";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type BlogRow = Database["public"]["Tables"]["blogs"]["Row"];

export const dynamic = "force-dynamic";

const columns: DataTableColumn<BlogRow>[] = [
  {
    key: "title",
    label: "Başlık",
    render: (row) => (
      <div>
        <p className="font-medium">{row.title}</p>
        <p className="text-xs text-muted-foreground">/{row.slug}</p>
      </div>
    ),
  },
  { key: "category", label: "Kategori", render: (row) => row.category ?? "—" },
  {
    key: "published_at",
    label: "Yayın Tarihi",
    render: (row) =>
      row.published_at
        ? new Date(row.published_at).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "—",
  },
  {
    key: "is_published",
    label: "Durum",
    render: (row) => (
      <Badge variant={row.is_published ? "default" : "secondary"}>
        {row.is_published ? "Yayında" : "Taslak"}
      </Badge>
    ),
  },
];

export default async function AdminBlogPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Blog / Haber / Duyuru</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için içerik yönetimi kullanılamıyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: posts, error } = await supabase
    .from("blogs")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: true });

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Blog / Haber / Duyuru</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-brand-error">
            İçerikler yüklenemedi: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog / Haber / Duyuru</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Yeni Yazı
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={posts}
        summary={`${posts.length} içerik`}
        emptyMessage="Henüz içerik yok. 'Yeni Yazı' ile ilk içeriği oluşturun. (El kitabından gelen mevcut yazılar, panele içerik girilene kadar sitede görünmeye devam eder.)"
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Düzenle">
              <Link href={`/admin/blog/${row.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <ConfirmButton
              message={
                row.is_published
                  ? `"${row.title}" yayından kaldırılsın mı?`
                  : `"${row.title}" sitede yayınlansın mı?`
              }
              action={toggleBlogPublished.bind(null, row.id, !row.is_published)}
              variant="outline"
              destructive={false}
            >
              {row.is_published ? "Yayından Kaldır" : "Yayınla"}
            </ConfirmButton>
            <ConfirmButton
              message={`"${row.title}" kalıcı olarak silinsin mi? Bu işlem geri alınamaz.`}
              action={deleteBlogPost.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />
    </div>
  );
}

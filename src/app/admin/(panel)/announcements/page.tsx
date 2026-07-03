import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { deleteAnnouncement } from "@/lib/actions/admin/announcements";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];

export const dynamic = "force-dynamic";

const columns: DataTableColumn<AnnouncementRow>[] = [
  {
    key: "title",
    label: "Başlık",
    render: (row) => (
      <div>
        <p className="font-medium">{row.title}</p>
        <p className="line-clamp-1 text-xs text-muted-foreground">{row.content}</p>
      </div>
    ),
  },
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

export default async function AdminAnnouncementsPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Duyurular</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için duyuru yönetimi kullanılamıyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Duyurular</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-brand-error">
            Duyurular yüklenemedi: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Duyurular</h1>
        <Button asChild>
          <Link href="/admin/announcements/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Yeni Duyuru
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={announcements}
        summary={`${announcements.length} duyuru`}
        emptyMessage="Henüz duyuru yok."
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Düzenle">
              <Link href={`/admin/announcements/${row.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <ConfirmButton
              message={`"${row.title}" duyurusu silinsin mi? Bu işlem geri alınamaz.`}
              action={deleteAnnouncement.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />
    </div>
  );
}

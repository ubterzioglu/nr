import Link from "next/link";
import { Plus, Pencil, Users } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { deleteWebinar, toggleWebinarPublished } from "@/lib/actions/admin/webinars";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type WebinarRow = Database["public"]["Tables"]["webinars"]["Row"];

export const dynamic = "force-dynamic";

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
}

const columns: DataTableColumn<WebinarRow>[] = [
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
  { key: "speaker", label: "Konuşmacı", render: (row) => row.speaker ?? "—" },
  {
    key: "webinar_date",
    label: "Tarih",
    render: (row) => formatDateTime(row.webinar_date),
  },
  {
    key: "capacity",
    label: "Kontenjan",
    render: (row) => (row.capacity ? String(row.capacity) : "Sınırsız"),
  },
  {
    key: "is_published",
    label: "Durum",
    render: (row) => (
      <div className="flex flex-wrap gap-1.5">
        <Badge variant={row.is_published ? "default" : "secondary"}>
          {row.is_published ? "Yayında" : "Taslak"}
        </Badge>
        {row.is_featured && <Badge variant="secondary">Öne çıkan</Badge>}
      </div>
    ),
  },
];

export default async function AdminWebinarsPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Webinar Yönetimi</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için webinar yönetimi kullanılamıyor.
            `.env.local` dosyasında Supabase değişkenlerini tanımlayın.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: webinars, error } = await supabase
    .from("webinars")
    .select("*")
    .order("webinar_date", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Webinar Yönetimi</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-brand-error">
            Webinarlar yüklenemedi: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Webinar Yönetimi</h1>
        <Button asChild>
          <Link href="/admin/webinars/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Yeni Webinar
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={webinars}
        summary={`${webinars.length} webinar`}
        emptyMessage="Henüz webinar yok. 'Yeni Webinar' ile ilk kaydı oluşturun."
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Katılımcılar">
              <Link href={`/admin/webinars/${row.id}/registrations`}>
                <Users className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" title="Düzenle">
              <Link href={`/admin/webinars/${row.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <ConfirmButton
              message={
                row.is_published
                  ? `"${row.title}" yayından kaldırılsın mı?`
                  : `"${row.title}" sitede yayınlansın mı?`
              }
              action={toggleWebinarPublished.bind(null, row.id, !row.is_published)}
              variant="outline"
              destructive={false}
            >
              {row.is_published ? "Yayından Kaldır" : "Yayınla"}
            </ConfirmButton>
            <ConfirmButton
              message={`"${row.title}" kalıcı olarak silinsin mi? Kayıtları da silinir; bu işlem geri alınamaz.`}
              action={deleteWebinar.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />
    </div>
  );
}

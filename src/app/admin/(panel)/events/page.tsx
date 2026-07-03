import Link from "next/link";
import { Plus, Pencil, Users } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { deleteEvent, toggleEventPublished } from "@/lib/actions/admin/events";
import { eventTypeLabels } from "@/lib/validations/admin";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

export const dynamic = "force-dynamic";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const columns: DataTableColumn<EventRow>[] = [
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
  {
    key: "event_type",
    label: "Tür",
    render: (row) =>
      eventTypeLabels[row.event_type as keyof typeof eventTypeLabels] ?? row.event_type,
  },
  { key: "event_date", label: "Tarih", render: (row) => formatDate(row.event_date) },
  {
    key: "capacity",
    label: "Kontenjan",
    render: (row) => (row.capacity ? String(row.capacity) : "Sınırsız"),
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

export default async function AdminEventsPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Etkinlik Yönetimi</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için etkinlik yönetimi kullanılamıyor.
            `.env.local` dosyasında Supabase değişkenlerini tanımlayın.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Etkinlik Yönetimi</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-brand-error">
            Etkinlikler yüklenemedi: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Etkinlik Yönetimi</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Yeni Etkinlik
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={events}
        summary={`${events.length} etkinlik`}
        emptyMessage="Henüz etkinlik yok. 'Yeni Etkinlik' ile ilk kaydı oluşturun."
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Katılımcılar">
              <Link href={`/admin/events/${row.id}/registrations`}>
                <Users className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" title="Düzenle">
              <Link href={`/admin/events/${row.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <ConfirmButton
              message={
                row.is_published
                  ? `"${row.title}" yayından kaldırılsın mı?`
                  : `"${row.title}" sitede yayınlansın mı?`
              }
              action={toggleEventPublished.bind(null, row.id, !row.is_published)}
              variant="outline"
              destructive={false}
            >
              {row.is_published ? "Yayından Kaldır" : "Yayınla"}
            </ConfirmButton>
            <ConfirmButton
              message={`"${row.title}" kalıcı olarak silinsin mi? Kayıtları da silinir; bu işlem geri alınamaz.`}
              action={deleteEvent.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />
    </div>
  );
}

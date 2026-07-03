import { createServerClient } from "@/lib/supabase/client";
import { setContactRead } from "@/lib/actions/admin/inbox";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];

export const dynamic = "force-dynamic";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
}

const columns: DataTableColumn<ContactRow>[] = [
  {
    key: "full_name",
    label: "Gönderen",
    render: (row) => (
      <div>
        <p className="font-medium">{row.full_name}</p>
        <p className="text-xs text-muted-foreground">
          {row.email}
          {row.city ? ` · ${row.city}` : ""}
        </p>
      </div>
    ),
  },
  {
    key: "message",
    label: "Mesaj",
    className: "max-w-lg",
    render: (row) => (
      <span className="line-clamp-3 text-muted-foreground">{row.message}</span>
    ),
  },
  {
    key: "created_at",
    label: "Tarih",
    render: (row) => formatDateTime(row.created_at),
  },
  {
    key: "is_read",
    label: "Durum",
    render: (row) => (
      <Badge variant={row.is_read ? "secondary" : "default"}>
        {row.is_read ? "Okundu" : "Yeni"}
      </Badge>
    ),
  },
];

export default async function AdminContactsPage() {
  const supabase = createServerClient();
  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">İletişim Mesajları</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için mesajlar görüntülenemiyor. Form
            bildirimleri e-posta ile gelmeye devam eder.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">İletişim Mesajları</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-brand-error">
            Mesajlar yüklenemedi: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  const unreadCount = contacts.filter((contact) => !contact.is_read).length;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">İletişim Mesajları</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Bize Ulaşın formundan gelen mesajlar; ayrıca bildirim e-postası olarak da
        iletilir.
      </p>

      <DataTable
        columns={columns}
        rows={contacts}
        summary={`${contacts.length} mesaj · ${unreadCount} okunmamış`}
        emptyMessage="Henüz mesaj yok."
        actions={(row) => (
          <ConfirmButton
            message={
              row.is_read
                ? "Mesaj okunmadı olarak işaretlensin mi?"
                : "Mesaj okundu olarak işaretlensin mi?"
            }
            action={setContactRead.bind(null, row.id, !row.is_read)}
            variant="outline"
            destructive={false}
          >
            {row.is_read ? "Okunmadı Yap" : "Okundu"}
          </ConfirmButton>
        )}
      />
    </div>
  );
}

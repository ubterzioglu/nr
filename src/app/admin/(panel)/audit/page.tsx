import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/client";
import { getAdminSession } from "@/lib/admin/session";
import { isSuperAdmin } from "@/lib/admin/permissions";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type AuditRow = Database["public"]["Tables"]["audit_log"]["Row"];

export const dynamic = "force-dynamic";

const columns: DataTableColumn<AuditRow>[] = [
  {
    key: "created_at",
    label: "Zaman",
    render: (row) =>
      new Date(row.created_at).toLocaleString("tr-TR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Istanbul",
      }),
  },
  { key: "admin_label", label: "Yönetici" },
  { key: "action", label: "İşlem" },
  {
    key: "entity",
    label: "Kayıt",
    render: (row) => (
      <span className="text-muted-foreground">
        {row.entity}
        {row.entity_id ? ` · ${row.entity_id.slice(0, 8)}…` : ""}
        {row.detail ? ` · ${row.detail}` : ""}
      </span>
    ),
  },
];

export default async function AdminAuditPage() {
  const session = await getAdminSession();
  if (!session || !isSuperAdmin(session)) redirect("/admin");

  const supabase = createServerClient();
  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Denetim Kaydı</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için denetim kaydı görüntülenemiyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: entries } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Denetim Kaydı</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Hassas admin işlemlerinin izi (yalnızca Süper Admin görebilir). Şimdilik
        kullanıcı yönetimi işlemleri kaydedilir; kapsam genişletilecek.
      </p>

      <DataTable
        columns={columns}
        rows={entries ?? []}
        summary={`Son ${entries?.length ?? 0} kayıt`}
        emptyMessage="Henüz denetim kaydı yok."
      />
    </div>
  );
}

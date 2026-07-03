import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { deleteDepartment } from "@/lib/actions/admin/organization";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type DepartmentRow = Database["public"]["Tables"]["departments"]["Row"];

export const dynamic = "force-dynamic";

const columns: DataTableColumn<DepartmentRow>[] = [
  {
    key: "title",
    label: "Başkanlık",
    render: (row) => (
      <div>
        <p className="font-medium">
          {row.icon ? `${row.icon} ` : ""}
          {row.title}
        </p>
        <p className="text-xs text-muted-foreground">/{row.slug}</p>
      </div>
    ),
  },
  {
    key: "description",
    label: "Açıklama",
    className: "max-w-md",
    render: (row) => (
      <span className="line-clamp-2 text-muted-foreground">{row.description ?? "—"}</span>
    ),
  },
  { key: "sort_order", label: "Sıra", render: (row) => String(row.sort_order) },
  {
    key: "is_active",
    label: "Durum",
    render: (row) => (
      <Badge variant={row.is_active ? "default" : "secondary"}>
        {row.is_active ? "Yayında" : "Gizli"}
      </Badge>
    ),
  },
];

export default async function AdminDepartmentsPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Başkanlıklar</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için başkanlık yönetimi kullanılamıyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: departments } = await supabase
    .from("departments")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Başkanlıklar</h1>
        <Button asChild>
          <Link href="/admin/departments/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Yeni Başkanlık
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={departments ?? []}
        summary={`${departments?.length ?? 0} başkanlık`}
        emptyMessage="Henüz başkanlık kaydı yok. (DB boşken site config'teki başkanlıkları göstermeye devam eder.)"
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Düzenle">
              <Link href={`/admin/departments/${row.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <ConfirmButton
              message={`"${row.title}" başkanlığı silinsin mi?`}
              action={deleteDepartment.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />
    </div>
  );
}

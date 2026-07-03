import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { deleteBoardMember } from "@/lib/actions/admin/organization";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type BoardMemberRow = Database["public"]["Tables"]["board_members"]["Row"];

export const dynamic = "force-dynamic";

const columns: DataTableColumn<BoardMemberRow>[] = [
  {
    key: "name",
    label: "Üye",
    render: (row) => (
      <div className="flex items-center gap-3">
        {row.photo_url && (
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image src={row.photo_url} alt="" fill unoptimized className="object-cover" />
          </div>
        )}
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.role}</p>
        </div>
      </div>
    ),
  },
  { key: "department", label: "Birim", render: (row) => row.department ?? "—" },
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

export default async function AdminBoardPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Yönetim Kadrosu</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için kadro yönetimi kullanılamıyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: members } = await supabase
    .from("board_members")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Yönetim Kadrosu</h1>
        <Button asChild>
          <Link href="/admin/board/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Yeni Üye
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={members ?? []}
        summary={`${members?.length ?? 0} üye`}
        emptyMessage="Henüz kadro üyesi yok. (DB boşken site config'teki kadroyu göstermeye devam eder.)"
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Düzenle">
              <Link href={`/admin/board/${row.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <ConfirmButton
              message={`"${row.name}" kadrodan silinsin mi?`}
              action={deleteBoardMember.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />
    </div>
  );
}

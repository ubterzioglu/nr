import Link from "next/link";
import { Eye } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import {
  setRevisionStatus,
  deleteRevisionRequest,
  type RevisionStatus,
} from "@/lib/actions/admin/revisions";
import { revisionStatusLabels } from "@/lib/revision-status";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type RequestRow = Database["public"]["Tables"]["revision_requests"]["Row"];

export const dynamic = "force-dynamic";

const statusActions: { status: RevisionStatus; label: string }[] = [
  { status: "planned", label: "Planlandı" },
  { status: "done", label: "Yapıldı" },
  { status: "rejected", label: "Reddet" },
  { status: "open", label: "Yeniden Aç" },
];

const columns: DataTableColumn<RequestRow>[] = [
  {
    key: "title",
    label: "İstek",
    className: "max-w-md",
    render: (row) => (
      <div>
        <p className="font-medium">{row.title}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{row.description}</p>
      </div>
    ),
  },
  { key: "author_name", label: "Açan" },
  {
    key: "created_at",
    label: "Tarih",
    render: (row) =>
      new Date(row.created_at).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    key: "status",
    label: "Durum",
    render: (row) => {
      const status = revisionStatusLabels[row.status] ?? revisionStatusLabels.open;
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
];

export default async function AdminRevisionsPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Revizyon İstekleri</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için revizyon istekleri görüntülenemiyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: requests, error } = await supabase
    .from("revision_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Revizyon İstekleri</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-brand-error">
            İstekler yüklenemedi: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Revizyon İstekleri</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Üyelerin açtığı geliştirme istekleri. Yorum yazmak için isteğin detay
        sayfasını kullanın; yorumunuz &quot;Yönetim&quot; rozetiyle görünür.
      </p>

      <DataTable
        columns={columns}
        rows={requests}
        summary={`${requests.length} istek`}
        emptyMessage="Henüz revizyon isteği yok."
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Detay & yorumlar">
              <Link href={`/revizyon-istekleri/${row.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            {statusActions
              .filter((action) => action.status !== row.status)
              .slice(0, 3)
              .map((action) => (
                <ConfirmButton
                  key={action.status}
                  message={`"${row.title}" isteği "${revisionStatusLabels[action.status].label}" olarak işaretlensin mi?`}
                  action={setRevisionStatus.bind(null, row.id, action.status)}
                  variant="outline"
                  destructive={false}
                >
                  {action.label}
                </ConfirmButton>
              ))}
            <ConfirmButton
              message={`"${row.title}" isteği ve tüm yorumları silinsin mi? Bu işlem geri alınamaz.`}
              action={deleteRevisionRequest.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />
    </div>
  );
}

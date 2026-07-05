import Link from "next/link";
import { Eye } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import {
  setFeedbackStatus,
  deleteFeedback,
} from "@/lib/actions/admin/feedback";
import { feedbackStatusLabels } from "@/lib/feedback-status";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database, FeedbackStatus } from "@/types/database";

type FeedbackRow = Database["public"]["Tables"]["feedback"]["Row"];

export const dynamic = "force-dynamic";

const statusActions: { status: FeedbackStatus; label: string }[] = [
  { status: "reviewing", label: "İncelemede" },
  { status: "resolved", label: "Çözüldü" },
  { status: "rejected", label: "Reddet" },
  { status: "open", label: "Yeniden Aç" },
];

const columns: DataTableColumn<FeedbackRow>[] = [
  {
    key: "title",
    label: "Geri Bildirim",
    className: "max-w-md",
    render: (row) => (
      <div>
        <p className="font-medium">{row.title}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{row.description}</p>
      </div>
    ),
  },
  { key: "author_name", label: "Gönderen" },
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
      const status = feedbackStatusLabels[row.status] ?? feedbackStatusLabels.open;
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
];

export default async function AdminFeedbackPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Kullanıcı Geri Bildirimleri</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için geri bildirimler görüntülenemiyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: items, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Kullanıcı Geri Bildirimleri</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-brand-error">
            Geri bildirimler yüklenemedi: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Kullanıcı Geri Bildirimleri</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Üyelerin gönderdiği geri bildirimler. Yorum yazmak için detay
        sayfasını kullanın; yorumunuz &quot;Yönetim&quot; rozetiyle görünür.
      </p>

      <DataTable
        columns={columns}
        rows={items}
        summary={`${items.length} geri bildirim`}
        emptyMessage="Henüz geri bildirim yok."
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Detay & yorumlar">
              <Link href={`/geri-bildirim/${row.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            {statusActions
              .filter((action) => action.status !== row.status)
              .slice(0, 3)
              .map((action) => (
                <ConfirmButton
                  key={action.status}
                  message={`"${row.title}" geri bildirimi "${feedbackStatusLabels[action.status].label}" olarak işaretlensin mi?`}
                  action={setFeedbackStatus.bind(null, row.id, action.status)}
                  variant="outline"
                  destructive={false}
                >
                  {action.label}
                </ConfirmButton>
              ))}
            <ConfirmButton
              message={`"${row.title}" geri bildirimi silinsin mi? Bu işlem geri alınamaz.`}
              action={deleteFeedback.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />
    </div>
  );
}

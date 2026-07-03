import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type RegistrationRow = Database["public"]["Tables"]["event_registrations"]["Row"];

interface RegistrationListProps {
  targetType: "event" | "webinar";
  targetId: string;
}

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

const columns: DataTableColumn<RegistrationRow>[] = [
  { key: "full_name", label: "Ad Soyad" },
  { key: "email", label: "E-posta" },
  {
    key: "created_at",
    label: "Kayıt Tarihi",
    render: (row) => formatDateTime(row.created_at),
  },
  {
    key: "status",
    label: "Durum",
    render: (row) => (
      <Badge variant={row.status === "registered" ? "default" : "secondary"}>
        {row.status === "registered" ? "Kayıtlı" : "İptal"}
      </Badge>
    ),
  },
  {
    key: "attended",
    label: "Katılım",
    render: (row) =>
      row.attended === null ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        <Badge variant={row.attended ? "default" : "secondary"}>
          {row.attended ? "Katıldı" : "Katılmadı"}
        </Badge>
      ),
  },
];

/** Etkinlik/webinar katılımcı listesi — event ve webinar sayfalarında ortak. */
export async function RegistrationList({ targetType, targetId }: RegistrationListProps) {
  const supabase = createServerClient();
  const backHref = targetType === "event" ? "/admin/events" : "/admin/webinars";

  if (!supabase) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          Supabase yapılandırılmadığı için katılımcı listesi görüntülenemiyor.
        </CardContent>
      </Card>
    );
  }

  const targetTable = targetType === "event" ? "events" : "webinars";
  const targetColumn = targetType === "event" ? "event_id" : "webinar_id";

  const [{ data: target }, { data: registrations, error }] = await Promise.all([
    supabase.from(targetTable).select("title, capacity").eq("id", targetId).maybeSingle(),
    supabase
      .from("event_registrations")
      .select("*")
      .eq(targetColumn, targetId)
      .order("created_at", { ascending: false }),
  ]);

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-brand-error">
          Katılımcılar yüklenemedi: {error.message}
        </CardContent>
      </Card>
    );
  }

  const rows = registrations ?? [];
  const activeCount = rows.filter((row) => row.status === "registered").length;
  const attendedCount = rows.filter((row) => row.attended === true).length;
  const capacityLabel = target?.capacity ? ` / ${target.capacity} kontenjan` : "";

  return (
    <div>
      <Button asChild variant="secondary" size="sm" className="mb-6">
        <Link href={backHref}>
          <ArrowLeft className="h-4 w-4" /> Geri
        </Link>
      </Button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Katılımcılar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {target?.title ?? "—"} · {activeCount} aktif kayıt{capacityLabel}
            {attendedCount > 0 ? ` · ${attendedCount} katıldı` : ""}
          </p>
        </div>
        <Button asChild variant="outline">
          <a
            href={`/admin/api/registrations-csv?type=${targetType}&id=${targetId}`}
            download
          >
            <Download className="mr-1.5 h-4 w-4" />
            CSV İndir
          </a>
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        summary={`${rows.length} kayıt`}
        emptyMessage="Bu etkinliğe henüz kayıt yok."
      />
    </div>
  );
}

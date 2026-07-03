import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { markAllUnsetAttendance } from "@/lib/actions/admin/registrations";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { AttendanceButtons } from "@/components/admin/attendance-buttons";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type RegistrationRow = Database["public"]["Tables"]["event_registrations"]["Row"];

export type AttendanceFilter = "all" | "attended" | "absent" | "unset";

interface RegistrationListProps {
  targetType: "event" | "webinar";
  targetId: string;
  filter?: AttendanceFilter;
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
export async function RegistrationList({
  targetType,
  targetId,
  filter = "all",
}: RegistrationListProps) {
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

  const allRows = registrations ?? [];
  const activeCount = allRows.filter((row) => row.status === "registered").length;
  const attendedCount = allRows.filter((row) => row.attended === true).length;
  const absentCount = allRows.filter((row) => row.attended === false).length;
  const unsetCount = allRows.filter(
    (row) => row.status === "registered" && row.attended === null
  ).length;
  const capacityLabel = target?.capacity ? ` / ${target.capacity} kontenjan` : "";

  const rows = allRows.filter((row) => {
    if (filter === "attended") return row.attended === true;
    if (filter === "absent") return row.attended === false;
    if (filter === "unset") return row.attended === null && row.status === "registered";
    return true;
  });

  const baseHref =
    targetType === "event"
      ? `/admin/events/${targetId}/registrations`
      : `/admin/webinars/${targetId}/registrations`;

  const filterChips: { value: AttendanceFilter; label: string }[] = [
    { value: "all", label: `Tümü (${allRows.length})` },
    { value: "attended", label: `Katıldı (${attendedCount})` },
    { value: "absent", label: `Katılmadı (${absentCount})` },
    { value: "unset", label: `İşaretsiz (${unsetCount})` },
  ];

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
        <div className="flex flex-wrap items-center gap-2">
          {unsetCount > 0 && (
            <>
              <ConfirmButton
                message={`İşaretsiz ${unsetCount} kayıt "Katıldı" yapılsın mı?`}
                action={markAllUnsetAttendance.bind(null, targetType, targetId, true)}
                variant="outline"
                destructive={false}
              >
                Kalanları Katıldı Yap
              </ConfirmButton>
              <ConfirmButton
                message={`İşaretsiz ${unsetCount} kayıt "Katılmadı" yapılsın mı?`}
                action={markAllUnsetAttendance.bind(null, targetType, targetId, false)}
                variant="outline"
                destructive={false}
              >
                Kalanları Katılmadı Yap
              </ConfirmButton>
            </>
          )}
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
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filterChips.map((chip) => (
          <Link
            key={chip.value}
            href={chip.value === "all" ? baseHref : `${baseHref}?filtre=${chip.value}`}
            className={cn(
              "rounded-full border border-border px-3.5 py-1.5 text-sm",
              filter === chip.value &&
                "border-brand-primary bg-brand-primary/10 text-brand-primary"
            )}
          >
            {chip.label}
          </Link>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        summary={`${rows.length} kayıt`}
        emptyMessage="Bu filtreye uyan kayıt yok."
        actions={(row) => (
          <AttendanceButtons
            registrationId={row.id}
            targetType={targetType}
            targetId={targetId}
            attended={row.attended}
          />
        )}
      />
    </div>
  );
}

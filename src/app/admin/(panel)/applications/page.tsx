import Link from "next/link";
import { createServerClient } from "@/lib/supabase/client";
import { applicationTypeLabels } from "@/config/site";
import type { ApplicationType } from "@/types";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ApplicationStatusButtons } from "@/components/admin/status-buttons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" }> = {
  pending: { label: "Bekliyor", variant: "secondary" },
  approved: { label: "Onaylandı", variant: "default" },
  rejected: { label: "Reddedildi", variant: "secondary" },
};

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

const columns: DataTableColumn<ApplicationRow>[] = [
  {
    key: "full_name",
    label: "Ad Soyad",
    render: (row) => (
      <div>
        <p className="font-medium">{row.full_name}</p>
        <p className="text-xs text-muted-foreground">{row.email}</p>
      </div>
    ),
  },
  {
    key: "type",
    label: "Tür",
    render: (row) =>
      applicationTypeLabels[row.type as ApplicationType] ?? row.type,
  },
  { key: "city", label: "Şehir", render: (row) => row.city ?? "—" },
  {
    key: "message",
    label: "Mesaj",
    className: "max-w-md",
    render: (row) => (
      <span className="line-clamp-2 text-muted-foreground">{row.message ?? "—"}</span>
    ),
  },
  {
    key: "created_at",
    label: "Tarih",
    render: (row) => formatDateTime(row.created_at),
  },
  {
    key: "status",
    label: "Durum",
    render: (row) => {
      const status = statusLabels[row.status] ?? statusLabels.pending;
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
];

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const typeFilter = typeof params.tur === "string" ? params.tur : undefined;

  const supabase = createServerClient();
  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Başvurular</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için başvurular görüntülenemiyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  let query = supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (typeFilter) query = query.eq("type", typeFilter);

  const { data: applications, error } = await query;

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Başvurular</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-brand-error">
            Başvurular yüklenemedi: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  const filterOptions = Object.entries(applicationTypeLabels) as [
    ApplicationType,
    string,
  ][];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Başvurular</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/applications"
          className={cn(
            "rounded-full border border-border px-3.5 py-1.5 text-sm",
            !typeFilter && "border-brand-primary bg-brand-primary/10 text-brand-primary"
          )}
        >
          Tümü
        </Link>
        {filterOptions.map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/applications?tur=${value}`}
            className={cn(
              "rounded-full border border-border px-3.5 py-1.5 text-sm",
              typeFilter === value &&
                "border-brand-primary bg-brand-primary/10 text-brand-primary"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={applications}
        summary={`${applications.length} başvuru`}
        emptyMessage="Bu türde başvuru yok."
        actions={(row) => (
          <ApplicationStatusButtons id={row.id} current={row.status} />
        )}
      />
    </div>
  );
}

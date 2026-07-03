import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import {
  deleteSponsor,
  toggleSponsorActive,
  setSponsorInquiryRead,
} from "@/lib/actions/admin/sponsors";
import { sponsorTierLabels } from "@/lib/data/sponsors";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type SponsorRow = Database["public"]["Tables"]["sponsors"]["Row"];
type InquiryRow = Database["public"]["Tables"]["sponsor_inquiries"]["Row"];

export const dynamic = "force-dynamic";

const sponsorColumns: DataTableColumn<SponsorRow>[] = [
  {
    key: "name",
    label: "Kurum",
    render: (row) => (
      <div className="flex items-center gap-3">
        {row.logo_url && (
          <div className="relative h-8 w-16 shrink-0 overflow-hidden rounded bg-white p-0.5">
            <Image src={row.logo_url} alt="" fill unoptimized className="object-contain" />
          </div>
        )}
        <div>
          <p className="font-medium">{row.name}</p>
          {row.website_url && (
            <p className="text-xs text-muted-foreground">{row.website_url}</p>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "tier",
    label: "Paket",
    render: (row) => sponsorTierLabels[row.tier] ?? row.tier,
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

const inquiryColumns: DataTableColumn<InquiryRow>[] = [
  {
    key: "company",
    label: "Şirket",
    render: (row) => (
      <div>
        <p className="font-medium">{row.company}</p>
        <p className="text-xs text-muted-foreground">
          {row.contact_name} · {row.email}
        </p>
      </div>
    ),
  },
  {
    key: "message",
    label: "Mesaj",
    className: "max-w-md",
    render: (row) => (
      <span className="line-clamp-2 text-muted-foreground">{row.message ?? "—"}</span>
    ),
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

export default async function AdminSponsorsPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Sponsor Yönetimi</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için sponsor yönetimi kullanılamıyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const [{ data: sponsors }, { data: inquiries }] = await Promise.all([
    supabase.from("sponsors").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("sponsor_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sponsor Yönetimi</h1>
        <Button asChild>
          <Link href="/admin/sponsors/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Yeni Sponsor
          </Link>
        </Button>
      </div>

      <DataTable
        columns={sponsorColumns}
        rows={sponsors ?? []}
        summary={`${sponsors?.length ?? 0} sponsor`}
        emptyMessage="Henüz sponsor yok."
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Düzenle">
              <Link href={`/admin/sponsors/${row.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <ConfirmButton
              message={
                row.is_active
                  ? `"${row.name}" sitede gizlensin mi?`
                  : `"${row.name}" sitede gösterilsin mi?`
              }
              action={toggleSponsorActive.bind(null, row.id, !row.is_active)}
              variant="outline"
              destructive={false}
            >
              {row.is_active ? "Gizle" : "Göster"}
            </ConfirmButton>
            <ConfirmButton
              message={`"${row.name}" kalıcı olarak silinsin mi?`}
              action={deleteSponsor.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />

      <h2 className="mb-4 mt-10 text-xl font-bold">İş Birliği Başvuruları</h2>
      <DataTable
        columns={inquiryColumns}
        rows={inquiries ?? []}
        summary={`${inquiries?.length ?? 0} başvuru`}
        emptyMessage="Henüz iş birliği başvurusu yok."
        actions={(row) => (
          <ConfirmButton
            message={
              row.is_read
                ? "Başvuru okunmadı olarak işaretlensin mi?"
                : "Başvuru okundu olarak işaretlensin mi?"
            }
            action={setSponsorInquiryRead.bind(null, row.id, !row.is_read)}
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

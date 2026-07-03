import Link from "next/link";
import { Eye } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { getAdminSession } from "@/lib/admin/session";
import { isSuperAdmin, adminRoleLabels } from "@/lib/admin/permissions";
import { setUserActive } from "@/lib/actions/admin/users";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { UserRoleControls } from "@/components/admin/user-role-controls";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Database, UserRole } from "@/types/database";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  const supabase = createServerClient();
  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için kullanıcı yönetimi kullanılamıyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const session = await getAdminSession();
  const canAssignAdminRole = session ? isSuperAdmin(session) : false;

  let usersQuery = supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (query) {
    usersQuery = usersQuery.or(`email.ilike.%${query}%,full_name.ilike.%${query}%`);
  }

  const [{ data: users, error }, { data: roles }] = await Promise.all([
    usersQuery,
    supabase.from("roles").select("id, name"),
  ]);

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-brand-error">
            Kullanıcılar yüklenemedi: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  const roleNameById = new Map((roles ?? []).map((role) => [role.id, role.name]));

  const columns: DataTableColumn<UserRow>[] = [
    {
      key: "full_name",
      label: "Üye",
      render: (row) => (
        <div>
          <p className="font-medium">{row.full_name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {row.email}
            {row.username ? ` · @${row.username}` : ""}
          </p>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Kayıt",
      render: (row) =>
        new Date(row.created_at).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "roles",
      label: "Roller",
      render: (row) => {
        const communityRole = row.role_id
          ? (roleNameById.get(row.role_id) as UserRole | undefined)
          : undefined;
        return (
          <UserRoleControls
            userId={row.id}
            communityRole={communityRole ?? null}
            adminRole={row.admin_role}
            canAssignAdminRole={canAssignAdminRole}
          />
        );
      },
    },
    {
      key: "is_active",
      label: "Durum",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <Badge variant={row.is_active ? "default" : "secondary"}>
            {row.is_active ? "Aktif" : "Pasif"}
          </Badge>
          {row.admin_role && (
            <Badge variant="secondary">{adminRoleLabels[row.admin_role]}</Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Kullanıcı Yönetimi</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Üye listesi, rol atama ve hesap durumu. Panel yetkisini yalnızca Süper
        Admin değiştirebilir.
      </p>

      <form method="GET" className="mb-6 flex max-w-md gap-3">
        <Input name="q" defaultValue={query} placeholder="İsim veya e-posta ara..." />
        <Button type="submit" variant="outline">
          Ara
        </Button>
      </form>

      <DataTable
        columns={columns}
        rows={users ?? []}
        summary={`${users?.length ?? 0} üye${query ? ` · "${query}" araması` : ""}`}
        emptyMessage={query ? "Aramaya uyan üye yok." : "Henüz üye yok."}
        actions={(row) => (
          <>
            <Button asChild variant="ghost" size="sm" title="Profil & geçmiş">
              <Link href={`/admin/users/${row.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <ConfirmButton
              message={
                row.is_active
                  ? `${row.full_name ?? row.email} pasife alınsın mı? Pasif üye panele ve üye alanlarına erişemez.`
                  : `${row.full_name ?? row.email} yeniden aktifleştirilsin mi?`
              }
              action={setUserActive.bind(null, row.id, !row.is_active)}
              variant="outline"
              destructive={row.is_active}
            >
              {row.is_active ? "Pasife Al" : "Aktifleştir"}
            </ConfirmButton>
          </>
        )}
      />
    </div>
  );
}

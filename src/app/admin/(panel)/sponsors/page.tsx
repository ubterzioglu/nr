import { AdminModuleList, adminStaticData } from "@/components/admin/admin-module-list";

export default function AdminSponsorsPage() {
  return (
    <AdminModuleList
      title="Sponsor Yönetimi"
      items={adminStaticData.sponsors}
      columns={[
        { key: "name", label: "Kurum" },
        { key: "tier", label: "Seviye" },
      ]}
      emptyMessage="Henüz kayıtlı sponsor yok."
    />
  );
}

import { AdminModuleList, adminStaticData } from "@/components/admin/admin-module-list";

export default function AdminApplicationsPage() {
  return (
    <AdminModuleList
      title="Başvurular"
      items={adminStaticData.applications}
      columns={[
        { key: "name", label: "Ad Soyad" },
        { key: "type", label: "Tür" },
        { key: "status", label: "Durum" },
        { key: "date", label: "Tarih" },
      ]}
    />
  );
}

import { AdminModuleList, adminStaticData } from "@/components/admin/admin-module-list";

export default function AdminEventsPage() {
  return (
    <AdminModuleList
      title="Etkinlik Yönetimi"
      items={adminStaticData.events}
      columns={[
        { key: "title", label: "Başlık" },
        { key: "type", label: "Tür" },
        { key: "status", label: "Durum" },
        { key: "date", label: "Tarih" },
      ]}
    />
  );
}

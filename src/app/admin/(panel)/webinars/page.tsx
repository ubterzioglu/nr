import { AdminModuleList, adminStaticData } from "@/components/admin/admin-module-list";

export default function AdminWebinarsPage() {
  return (
    <AdminModuleList
      title="Webinar Yönetimi"
      items={adminStaticData.webinars}
      columns={[
        { key: "title", label: "Başlık" },
        { key: "date", label: "Tarih" },
        { key: "status", label: "Durum" },
      ]}
    />
  );
}

import { AdminModuleList, adminStaticData } from "@/components/admin/admin-module-list";

export default function AdminAnnouncementsPage() {
  return (
    <AdminModuleList
      title="Duyurular"
      items={adminStaticData.announcements}
      columns={[
        { key: "title", label: "Başlık" },
        { key: "date", label: "Tarih" },
        { key: "published", label: "Durum" },
      ]}
    />
  );
}

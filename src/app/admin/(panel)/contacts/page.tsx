import { AdminModuleList, adminStaticData } from "@/components/admin/admin-module-list";

export default function AdminContactsPage() {
  return (
    <AdminModuleList
      title="İletişim Mesajları"
      items={adminStaticData.contacts}
      columns={[
        { key: "full_name", label: "Ad Soyad" },
        { key: "email", label: "E-posta" },
        { key: "message", label: "Mesaj" },
        { key: "created_at", label: "Tarih" },
      ]}
    />
  );
}

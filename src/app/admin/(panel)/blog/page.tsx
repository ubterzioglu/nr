import { AdminModuleList, adminStaticData } from "@/components/admin/admin-module-list";

export default function AdminBlogPage() {
  return (
    <AdminModuleList
      title="Blog Yönetimi"
      items={adminStaticData.blog}
      columns={[
        { key: "title", label: "Başlık" },
        { key: "category", label: "Kategori" },
        { key: "date", label: "Tarih" },
      ]}
    />
  );
}

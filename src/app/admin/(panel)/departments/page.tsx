import { AdminModuleList, adminStaticData } from "@/components/admin/admin-module-list";

export default function AdminDepartmentsPage() {
  return (
    <AdminModuleList
      title="Başkanlıklar"
      items={adminStaticData.departments}
      columns={[
        { key: "title", label: "Başkanlık" },
        { key: "slug", label: "Slug" },
      ]}
    />
  );
}

import { AdminModuleList, adminStaticData } from "@/components/admin/admin-module-list";

export default function AdminBoardPage() {
  return (
    <AdminModuleList
      title="Yönetim Kadrosu"
      items={adminStaticData.board}
      columns={[
        { key: "name", label: "İsim" },
        { key: "role", label: "Rol" },
        { key: "department", label: "Departman" },
      ]}
    />
  );
}

import { BoardMemberForm } from "@/components/admin/organization-forms";

export default function AdminNewBoardMemberPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Yeni Kadro Üyesi</h1>
      <BoardMemberForm />
    </div>
  );
}

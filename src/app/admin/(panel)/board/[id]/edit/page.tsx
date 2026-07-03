import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/client";
import { BoardMemberForm } from "@/components/admin/organization-forms";

export const dynamic = "force-dynamic";

export default async function AdminEditBoardMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const { data: member } = await supabase
    .from("board_members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!member) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Kadro Üyesini Düzenle</h1>
      <BoardMemberForm
        initial={{
          id: member.id,
          name: member.name,
          role: member.role,
          department: member.department ?? "",
          bio: member.bio ?? "",
          sortOrder: String(member.sort_order),
          isActive: member.is_active,
          photoUrl: member.photo_url,
        }}
      />
    </div>
  );
}

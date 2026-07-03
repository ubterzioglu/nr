import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/client";
import { DepartmentForm } from "@/components/admin/organization-forms";

export const dynamic = "force-dynamic";

export default async function AdminEditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const { data: department } = await supabase
    .from("departments")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!department) notFound();

  const highlights = Array.isArray(department.highlights)
    ? (department.highlights as string[]).join("\n")
    : "";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Başkanlığı Düzenle</h1>
      <DepartmentForm
        initial={{
          id: department.id,
          slug: department.slug,
          title: department.title,
          description: department.description ?? "",
          highlights,
          icon: department.icon ?? "",
          sortOrder: String(department.sort_order),
          isActive: department.is_active,
        }}
      />
    </div>
  );
}

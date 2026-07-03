import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/client";
import { AnnouncementForm } from "@/components/admin/announcement-form";

export const dynamic = "force-dynamic";

export default async function AdminEditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!announcement) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Duyuruyu Düzenle</h1>
      <AnnouncementForm
        initialValues={{
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          link: announcement.link ?? "",
          isPublished: announcement.is_published,
        }}
      />
    </div>
  );
}

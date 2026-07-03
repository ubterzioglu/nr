import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/client";
import { SponsorForm } from "@/components/admin/sponsor-form";

export const dynamic = "force-dynamic";

export default async function AdminEditSponsorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const { data: sponsor } = await supabase
    .from("sponsors")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!sponsor) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Sponsoru Düzenle</h1>
      <SponsorForm
        initial={{
          id: sponsor.id,
          name: sponsor.name,
          tier: sponsor.tier,
          websiteUrl: sponsor.website_url ?? "",
          description: sponsor.description ?? "",
          sortOrder: String(sponsor.sort_order),
          isActive: sponsor.is_active,
          logoUrl: sponsor.logo_url,
        }}
      />
    </div>
  );
}

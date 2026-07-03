import { createBrowserClient, createServerClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type SponsorRow = Database["public"]["Tables"]["sponsors"]["Row"];

export interface ActiveSponsor {
  id: string;
  name: string;
  tier: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
}

/**
 * Aktif sponsorlar (sıralamaya göre). Supabase yoksa veya sorgu hata
 * verirse boş liste döner — /sponsorlar sayfası boş durumunu gösterir.
 */
export async function getActiveSponsors(): Promise<ActiveSponsor[]> {
  const supabase = createServerClient() ?? createBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[NEXRISE] sponsor sorgusu başarısız:", error.message);
    return [];
  }

  return (data ?? []).map((row: SponsorRow) => ({
    id: row.id,
    name: row.name,
    tier: row.tier,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    description: row.description,
  }));
}

export const sponsorTierLabels: Record<string, string> = {
  platinum: "Platin Sponsor",
  gold: "Altın Sponsor",
  silver: "Gümüş Sponsor",
  partner: "Partner",
};

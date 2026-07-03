import { createServerClient } from "@/lib/supabase/client";

/**
 * settings tablosu key/value (JSONB) yapısındadır ve yalnızca service role
 * okuyabilir; bu modül server component/action'lardan kullanılır.
 */

export interface HeroSettings {
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export interface SocialLinkSettings {
  instagram: string;
  youtube: string;
  linkedin: string;
  whatsappChannel: string;
  whatsappCommunity: string;
  discord: string;
  telegram: string;
}

export const HERO_SETTING_KEY = "mvpubt_hero";
export const SOCIAL_SETTING_KEY = "social_links";

export async function getSetting<T>(key: string): Promise<T | null> {
  const supabase = createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error(`[NEXRISE] settings(${key}) sorgusu başarısız:`, error.message);
    return null;
  }
  return (data?.value as T) ?? null;
}

export async function getHeroSettings(): Promise<Partial<HeroSettings> | null> {
  return getSetting<Partial<HeroSettings>>(HERO_SETTING_KEY);
}

export async function getSocialLinkSettings(): Promise<Partial<SocialLinkSettings> | null> {
  return getSetting<Partial<SocialLinkSettings>>(SOCIAL_SETTING_KEY);
}

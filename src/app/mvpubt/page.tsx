import type { Metadata } from "next";
import { brand, social } from "@/config/site";
import { googleSnippet, pageMetadata } from "@/lib/seo";
import { getPublishedEvents } from "@/lib/data/events";
import { getPublishedWebinars } from "@/lib/data/webinars";
import { getHeroSettings, getSocialLinkSettings } from "@/lib/data/settings";
import { Hero } from "@/components/mvpubt/hero";
import { AboutPreview } from "@/components/mvpubt/about-preview";
import { Statistics } from "@/components/mvpubt/statistics";
import { CommunitiesPreview } from "@/components/mvpubt/communities-preview";
import { UpcomingEvents } from "@/components/mvpubt/upcoming-events";
import { FeaturedWebinars } from "@/components/mvpubt/featured-webinars";
import { FAQ } from "@/components/mvpubt/faq";
import { CallToAction } from "@/components/mvpubt/cta";
import { SocialFollow } from "@/components/mvpubt/social-follow";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${brand.name} — ${brand.slogan} (UBT)`,
    description: googleSnippet,
    path: "/mvpubt",
  }),
  robots: { index: false, follow: false },
};

/**
 * MVP UBT varyantı — backend/config ortak, frontend bileşenleri
 * `src/components/mvpubt/` altındaki bağımsız kopyalardır ve
 * serbestçe değiştirilebilir (orijinaller `src/components/home/`).
 */
export const revalidate = 60;

export default async function MvpUbtHomePage() {
  const [events, webinars, heroSettings, socialSettings] = await Promise.all([
    getPublishedEvents(),
    getPublishedWebinars(),
    getHeroSettings(),
    getSocialLinkSettings(),
  ]);

  // Panel ayarları config bağlantılarını isim eşleşmesiyle geçersiz kılar
  const settingsHrefByName: Record<string, string | undefined> = {
    Instagram: socialSettings?.instagram,
    YouTube: socialSettings?.youtube,
    LinkedIn: socialSettings?.linkedin,
    "WhatsApp Kanalı": socialSettings?.whatsappChannel,
    "WhatsApp Topluluğu": socialSettings?.whatsappCommunity,
  };
  const socialLinks = social.map((link) => ({
    ...link,
    href: settingsHrefByName[link.name] || link.href,
  }));

  return (
    <>
      <Hero content={heroSettings ?? undefined} />
      <AboutPreview />
      <Statistics />
      <CommunitiesPreview />
      <UpcomingEvents events={events} />
      <FeaturedWebinars webinars={webinars} />
      <FAQ />
      <SocialFollow links={socialLinks} />
      <CallToAction />
    </>
  );
}

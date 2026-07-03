import type { Metadata } from "next";
import { brand } from "@/config/site";

/** Google arama sonucu snippet metni — "NEXRISE" araması için */
export const googleSnippet =
  "NEXRISE — teknoloji, girişimcilik ve inovasyon odaklı bağımsız gençlik ekosistemi. Türkiye'nin 81 ilinden gençleri buluşturur. Webinar, eğitim, zirve, mentorluk. Rise of the Next Generation. @nexriseoff";

export function pageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexrise.com.tr";
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${brand.name}`,
      description,
      url,
      siteName: brand.name,
      type: "website",
      locale: "tr_TR",
      images: [
        { url: "/og-image.png", width: 1200, height: 630, alt: `${brand.name} — ${brand.slogan}` },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${brand.name}`,
      description,
      images: ["/og-image.png"],
    },
    alternates: { canonical: url },
  };
}

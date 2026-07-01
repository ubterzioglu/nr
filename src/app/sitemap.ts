import type { MetadataRoute } from "next";
import { brand, departments, events, webinars, blogPosts } from "@/config/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexrise.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "", "hakkimizda", "yonetim", "baskanliklar", "topluluklar",
    "etkinlikler", "webinarlar", "blog", "sponsorlar", "basvurular", "iletisim",
    "gizlilik-politikasi", "kullanim-sartlari",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}/${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...departments.map((d) => ({
      url: `${baseUrl}/baskanliklar/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...events.map((e) => ({
      url: `${baseUrl}/etkinlikler/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...webinars.map((w) => ({
      url: `${baseUrl}/webinarlar/${w.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

import type { Metadata } from "next";
import { brand } from "@/config/site";
import { googleSnippet, pageMetadata } from "@/lib/seo";
import { getPublishedEvents } from "@/lib/data/events";
import { getPublishedWebinars } from "@/lib/data/webinars";
import { Hero } from "@/components/home/hero";
import { AboutPreview } from "@/components/home/about-preview";
import { Statistics } from "@/components/home/statistics";
import { CommunitiesPreview } from "@/components/home/communities-preview";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { FeaturedWebinars } from "@/components/home/featured-webinars";
import { FAQ } from "@/components/home/faq";
import { CallToAction } from "@/components/home/cta";
import { SocialFollow } from "@/components/home/social-follow";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${brand.name} — ${brand.slogan}`,
    description: googleSnippet,
    path: "/mvp",
  }),
  robots: { index: false, follow: false },
};

export const revalidate = 60;

/** MVP ana sayfa — içerik geliştirmesi bu route üzerinden devam eder */
export default async function MvpHomePage() {
  const [events, webinars] = await Promise.all([getPublishedEvents(), getPublishedWebinars()]);

  return (
    <>
      <Hero />
      <AboutPreview />
      <Statistics />
      <CommunitiesPreview />
      <UpcomingEvents events={events} />
      <FeaturedWebinars webinars={webinars} />
      <FAQ />
      <SocialFollow />
      <CallToAction />
    </>
  );
}

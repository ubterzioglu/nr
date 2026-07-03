import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { brand } from "@/config/site";
import { googleSnippet, pageMetadata } from "@/lib/seo";
import { ComingSoon } from "@/components/coming-soon/coming-soon";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${brand.name} — Çok Yakında`,
    description: googleSnippet,
    path: "/",
  }),
  title: `${brand.name} | Çok Yakında — ${brand.slogan}`,
};

export default function HomePage() {
  return <ComingSoon displayClassName={spaceGrotesk.className} />;
}

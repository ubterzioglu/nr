import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { FooterSwitch } from "@/components/layout/footer-switch";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { brand } from "@/config/site";
import { googleSnippet } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexrise.com.tr"),
  title: {
    default: `${brand.name} | ${brand.slogan}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.seoDescription,
  keywords: [
    "NEXRISE",
    "nexrise",
    "teknoloji",
    "girişimcilik",
    "startup",
    "webinar",
    "gençlik ekosistemi",
    "inovasyon",
    "yapay zeka",
    "Türkiye",
    "Rise of the Next Generation",
  ],
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    title: `${brand.name} | ${brand.slogan}`,
    description: googleSnippet,
    type: "website",
    locale: "tr_TR",
    siteName: brand.name,
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: `${brand.name} — ${brand.slogan}` },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | ${brand.slogan}`,
    description: googleSnippet,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main>{children}</main>
          <FooterSwitch />
        </ThemeProvider>
      </body>
    </html>
  );
}

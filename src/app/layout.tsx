import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { brand } from "@/config/site";
import { googleSnippet } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | ${brand.slogan}`,
    description: googleSnippet,
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
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

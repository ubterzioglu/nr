"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { brand, navigation, social } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SocialIcon } from "@/components/shared/social-icons";

const pageLinks = navigation.slice(0, 8);

const corporateLinks = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Yönetim", href: "/yonetim" },
  { label: "Başkanlıklar", href: "/baskanliklar" },
  { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
  { label: "Başvurular", href: "/basvurular" },
  { label: "İletişim", href: "/iletisim" },
];

function FooterLinkRow({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/70">{title}</p>
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        {links.map((item, index) => (
          <li key={item.href} className="flex items-center gap-x-3">
            {index > 0 && <span aria-hidden className="h-3 w-px bg-white/15" />}
            <Link href={item.href} className="text-sm text-slate-300 transition-colors hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React SSR çıktısına muted attribute'u yazmadığı için autoplay
    // hidrasyon öncesi engellenebilir; burada elle tetiklenir.
    video.muted = true;
    video.play().catch(() => {
      // Autoplay engellenirse koyu degrade arka plan görünür kalır.
    });
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-border bg-brand-dark text-slate-300">
      <div aria-hidden="true" className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-60 motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/videos/footer-abstract.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/85 via-brand-dark/70 to-brand-dark/90" />
      </div>

      <Container className="relative py-16 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {social.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
              className="glass rounded-full p-3 text-slate-300 transition-all hover:border-brand-accent hover:text-white"
            >
              <SocialIcon icon={link.icon} className="h-5 w-5" />
            </a>
          ))}
        </div>

        <div className="mt-10 space-y-4">
          <p className="text-lg font-semibold text-white md:text-xl">
            {brand.name} — {brand.slogan}
          </p>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400">{brand.seoDescription}</p>
          <p className="text-xs uppercase tracking-widest text-brand-accent">{brand.slogan}</p>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-400">{brand.contactNote}</p>
          <Link
            href="/iletisim"
            className="inline-block text-sm text-brand-accent transition-colors hover:text-white"
          >
            İletişim sayfası →
          </Link>
        </div>

        <div className="mt-12 space-y-8">
          <FooterLinkRow title="Sayfalar" links={pageLinks} />
          <FooterLinkRow title="Kurumsal & Bağlantılar" links={corporateLinks} />
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-sm">
          © {year} NEXRISE Yönetim Kurulu. Tüm hakları saklıdır.
        </div>
      </Container>
    </footer>
  );
}

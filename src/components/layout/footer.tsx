import Link from "next/link";
import { brand, navigation, social } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { SocialBrandLogo, socialBrandStyles } from "@/components/shared/social-icons";

const corporateLinks = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Yönetim", href: "/yonetim" },
  { label: "Başkanlıklar", href: "/baskanliklar" },
  { label: "Nasıl Kullanılır?", href: "/howto" },
  { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-brand-dark text-slate-400">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed">{brand.seoDescription}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-brand-accent">{brand.slogan}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">{brand.contactNote}</p>
            <Link href="/iletisim" className="mt-2 inline-block text-sm text-brand-accent hover:text-white">
              İletişim sayfası →
            </Link>
            <div className="mt-6 flex flex-wrap gap-3">
              {social.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className={`rounded-xl border border-slate-700 p-2.5 transition-all hover:border-brand-primary hover:shadow-md ${socialBrandStyles[link.icon]}`}
                >
                  <SocialBrandLogo icon={link.icon} className="h-6 w-6" uid={`footer-${link.name}`} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-white">Sayfalar</p>
            <ul className="space-y-2.5">
              {navigation.slice(0, 8).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-white">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold text-white">Kurumsal & Bağlantılar</p>
            <ul className="space-y-2.5 text-sm">
              {corporateLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">{item.label}</Link>
                </li>
              ))}
              <li><Link href="/basvurular" className="hover:text-white">Başvurular</Link></li>
              <li><Link href="/iletisim" className="hover:text-white">İletişim</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
          © {year} NEXRISE Yönetim Kurulu. Tüm hakları saklıdır.
        </div>
      </Container>
    </footer>
  );
}

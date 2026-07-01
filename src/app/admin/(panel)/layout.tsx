import Link from "next/link";
import { isAdminAuthenticated, logoutAdmin } from "@/lib/admin/session";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/announcements", label: "Duyurular" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/webinars", label: "Webinarlar" },
  { href: "/admin/events", label: "Etkinlikler" },
  { href: "/admin/board", label: "Yönetim Kadrosu" },
  { href: "/admin/departments", label: "Başkanlıklar" },
  { href: "/admin/sponsors", label: "Sponsorlar" },
  { href: "/admin/applications", label: "Başvurular" },
  { href: "/admin/contacts", label: "İletişim Mesajları" },
  { href: "/admin/settings", label: "Site Ayarları" },
];

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <Container className="py-8">
        {!authed && (
          <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            Geliştirme modu aktif. Canlıda `ADMIN_SECRET` tanımlayın.{" "}
            <Link href="/admin/login" className="font-medium underline">Giriş yap</Link>
          </div>
        )}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-lg font-semibold">NEXRISE Admin</p>
          {authed ? (
            <form action={logoutAdmin}>
              <Button type="submit" variant="secondary" size="sm">Çıkış</Button>
            </form>
          ) : (
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin/login">Giriş</Link>
            </Button>
          )}
        </div>
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="rounded-2xl border border-border bg-card p-4">
            <nav className="space-y-1">
              {adminLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="lg:col-span-3">{children}</div>
        </div>
      </Container>
    </div>
  );
}

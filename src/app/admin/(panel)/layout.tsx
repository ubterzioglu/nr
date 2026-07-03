import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, logoutAdmin } from "@/lib/admin/session";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { href: "/admin/updates", label: "Güncellemeler" },
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/mail", label: "Mail Merkezi" },
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
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <Container className="py-8">
        {session.kind === "dev" && (
          <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            Geliştirme modu aktif: şifresiz erişim. Canlıda admin hesabı atayın
            veya `ADMIN_SECRET` tanımlayın.
          </div>
        )}
        {session.kind === "legacy" && (
          <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            Ortak yönetici şifresiyle giriş yapıldı. Kişisel admin hesabına
            geçin; geçiş tamamlanınca `ADMIN_LEGACY_LOGIN=false` ile bu yol
            kapatılacak.
          </div>
        )}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">NEXRISE Admin</p>
            {session.kind === "supabase" && (
              <p className="text-xs text-muted-foreground">
                {session.fullName ?? session.email}
              </p>
            )}
          </div>
          <form action={logoutAdmin}>
            <Button type="submit" variant="secondary" size="sm">Çıkış</Button>
          </form>
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

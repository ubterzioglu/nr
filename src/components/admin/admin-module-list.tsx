import {
  blogPosts,
  events,
  webinars,
  departments,
  management,
  sponsors,
  announcements,
  dashboardStats,
  recentApplications,
  recentMessages,
  applicationTypeLabels,
} from "@/config/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AdminModuleList({
  title,
  items,
  columns,
  emptyMessage = "Kayıt bulunamadı.",
}: {
  title: string;
  items: Record<string, string>[];
  columns: { key: string; label: string }[];
  emptyMessage?: string;
}) {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">
            {items.length} kayıt · Supabase bağlandığında canlı veri gösterilir
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    {columns.map((col) => (
                      <th key={col.key} className="pb-3 pr-4 font-medium">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b border-border/50">
                      {columns.map((col) => (
                        <td key={col.key} className="py-3 pr-4">{item[col.key] ?? "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const statusLabels = {
  pending: "Bekliyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

export function AdminDashboardStats() {
  const stats = [
    { icon: "📊", label: "Toplam Üye", value: dashboardStats.totalMembers > 0 ? String(dashboardStats.totalMembers) : "—", href: "/admin/settings" },
    { icon: "👥", label: "Toplam Başvuru", value: dashboardStats.totalApplications > 0 ? String(dashboardStats.totalApplications) : "—", href: "/admin/applications" },
    { icon: "🎤", label: "Yaklaşan Webinar", value: String(dashboardStats.upcomingWebinars), href: "/admin/webinars" },
    { icon: "📅", label: "Yaklaşan Etkinlik", value: String(dashboardStats.upcomingEvents), href: "/admin/events" },
    { icon: "📰", label: "Blog Sayısı", value: String(dashboardStats.blogCount), href: "/admin/blog" },
    { icon: "🏢", label: "Sponsor Sayısı", value: String(dashboardStats.sponsorCount), href: "/admin/sponsors" },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{s.icon}</span>
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <p className="text-3xl font-bold">{s.value}</p>
              <Button asChild variant="ghost" size="sm">
                <Link href={s.href}><ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              📈 Son Başvurular
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz başvuru yok. Supabase bağlandığında canlı veri gösterilir.</p>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {applicationTypeLabels[app.type]} · {app.date}
                    </p>
                  </div>
                  <Badge variant={app.status === "approved" ? "default" : "secondary"}>
                    {statusLabels[app.status]}
                  </Badge>
                </div>
              ))
            )}
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link href="/admin/applications">Tüm Başvurular</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              📬 Son Mesajlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz mesaj yok. Supabase bağlandığında canlı veri gösterilir.</p>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="border-b border-border/50 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{msg.name}</p>
                    {!msg.isRead && <Badge variant="secondary">Yeni</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{msg.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{msg.preview}</p>
                </div>
              ))
            )}
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link href="/admin/contacts">Tüm Mesajlar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export const adminStaticData = {
  blog: blogPosts.map((p) => ({ title: p.title, category: p.category, date: p.date })),
  events: events.map((e) => ({ title: e.title, type: e.type, status: e.status, date: e.date })),
  webinars: webinars.map((w) => ({ title: w.title, date: w.date, status: w.status, platform: w.platform })),
  departments: departments.map((d) => ({ title: d.title, slug: d.slug })),
  board: management.map((m) => ({ name: m.name, role: m.role, department: m.department ?? "—" })),
  sponsors: sponsors.map((s) => ({ name: s.name, tier: s.tier })),
  announcements: announcements.map((a) => ({ title: a.title, date: a.date, published: a.published ? "Yayında" : "Taslak" })),
  applications: recentApplications.map((a) => ({
    name: a.name,
    type: applicationTypeLabels[a.type],
    date: a.date,
    status: statusLabels[a.status],
  })),
  contacts: recentMessages.map((m) => ({
    full_name: m.name,
    email: m.email,
    message: m.preview,
    created_at: m.date,
  })),
};

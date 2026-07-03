import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAdminDashboardData } from "@/lib/data/admin-stats";
import { applicationTypeLabels } from "@/config/site";
import type { ApplicationType } from "@/types";
import { AdminDashboardStats } from "@/components/admin/admin-module-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const applicationStatusLabels: Record<string, string> = {
  pending: "Bekliyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Istanbul",
  });
}

/**
 * Canlı dashboard istatistikleri (content.pdf §3). Supabase
 * yapılandırılmamışsa mevcut config tabanlı karta düşer.
 */
export async function LiveDashboardStats() {
  const data = await getAdminDashboardData();
  if (!data) return <AdminDashboardStats />;

  const stats = [
    { icon: "👥", label: "Toplam Üye", value: data.totalMembers, href: "/admin" },
    { icon: "✨", label: "Bugünkü Üye Kaydı", value: data.todayMembers, href: "/admin" },
    { icon: "📅", label: "Yaklaşan Etkinlik", value: data.upcomingEvents, href: "/admin/events" },
    { icon: "🎤", label: "Yaklaşan Webinar", value: data.upcomingWebinars, href: "/admin/webinars" },
    { icon: "📋", label: "Bekleyen Başvuru", value: data.pendingApplications, href: "/admin/applications" },
    { icon: "🎟️", label: "Aktif Etkinlik Kaydı", value: data.totalRegistrations, href: "/admin/events" },
    {
      icon: "📧",
      label: "Mail (Son 30 Gün)",
      value: data.mail30d.sent,
      hint: data.mail30d.failed > 0 ? `${data.mail30d.failed} hatalı` : undefined,
      href: "/admin/contacts",
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{stat.icon}</span>
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                {stat.hint && (
                  <p className="text-xs text-brand-error">{stat.hint}</p>
                )}
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href={stat.href}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">✨ Son Katılan Üyeler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz üye yok.</p>
            ) : (
              data.recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="border-b border-border/50 pb-3 text-sm last:border-0"
                >
                  <p className="font-medium">{member.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email} · {formatDate(member.createdAt)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">📋 Son Başvurular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz başvuru yok.</p>
            ) : (
              data.recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between border-b border-border/50 pb-3 text-sm last:border-0"
                >
                  <div>
                    <p className="font-medium">{application.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {applicationTypeLabels[application.type as ApplicationType] ??
                        application.type}{" "}
                      · {formatDate(application.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant={application.status === "approved" ? "default" : "secondary"}
                  >
                    {applicationStatusLabels[application.status] ?? application.status}
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
            <CardTitle className="text-base">📬 Son Mesajlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz mesaj yok.</p>
            ) : (
              data.recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="border-b border-border/50 pb-3 text-sm last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{message.fullName}</p>
                    {!message.isRead && <Badge variant="secondary">Yeni</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{message.email}</p>
                  <p className="mt-1 line-clamp-1 text-muted-foreground">
                    {message.preview}
                  </p>
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

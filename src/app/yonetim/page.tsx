import type { Metadata } from "next";
import { management, userRoles, departments } from "@/config/site";
import { managementModel } from "@/config/content";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { TeamMemberCard } from "@/components/shared/team-member-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Yönetim",
  description: "NEXRISE yönetim kurulu ve organizasyon yapısı.",
  path: "/yonetim",
});

export default function YonetimPage() {
  return (
    <>
      <PageHeader
        eyebrow="Yönetim"
        title="Yönetim Kadrosu"
        description="NEXRISE Yönetim Kurulu ve organizasyon yapısı."
      />
      <section className="py-20">
        <Container>
          <SectionHeader title="Yönetim Kurulu Başkanı" />
          <div className="grid gap-6 lg:grid-cols-3">
            <TeamMemberCard member={management[0]} featured />
          </div>

          <div className="mt-16">
            <SectionHeader title={managementModel.title} description={managementModel.description} />
            <div className="grid gap-6 md:grid-cols-3">
              {managementModel.sections.map((section) => (
                <Card key={section.title}>
                  <CardHeader><CardTitle className="text-lg">{section.title}</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">{section.body}</p></CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <SectionHeader title="Çalışma İlkeleri" description="El kitabından — organizasyon prensipleri." />
            <ul className="grid gap-3 md:grid-cols-2">
              {managementModel.principles.map((p) => (
                <li key={p} className="rounded-xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16">
            <SectionHeader title="Başkanlık Sistemi" description={`${departments.length} başkanlık altında organize yapı.`} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((d) => (
                <Link
                  key={d.slug}
                  href={`/baskanliklar/${d.slug}`}
                  className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand-primary/40"
                >
                  <p className="font-semibold">{d.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{d.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <SectionHeader title="Kullanıcı Rolleri" description="Ekosistem içindeki rol hiyerarşisi." />
            <div className="flex flex-wrap gap-2">
              {userRoles.map((role) => (
                <Badge key={role} variant="secondary" className="px-4 py-2">{role}</Badge>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

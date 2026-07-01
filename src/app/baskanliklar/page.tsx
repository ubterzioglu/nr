import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Cpu, Rocket, Users, GraduationCap, Share2, Calendar } from "lucide-react";
import { departments } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkedinIcon } from "@/components/shared/social-icons";

export const metadata: Metadata = pageMetadata({
  title: "Başkanlıklar",
  description: "NEXRISE başkanlıkları — teknoloji, girişimcilik, kadın girişimcilik, lise, sosyal medya ve etkinlik.",
  path: "/baskanliklar",
});

const iconMap: Record<string, React.ElementType> = {
  cpu: Cpu,
  rocket: Rocket,
  users: Users,
  "graduation-cap": GraduationCap,
  "share-2": Share2,
  calendar: Calendar,
};

function DeptIcon({ icon, className }: { icon: string; className?: string }) {
  if (icon === "linkedin") {
    return <LinkedinIcon className={className} />;
  }
  const Icon = iconMap[icon] || Cpu;
  return <Icon className={className} />;
}

export default function BaskanliklarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Başkanlıklar"
        title="Başkanlıklar"
        description="Yönetim Kurulu koordinasyonunda faaliyet gösteren 6 başkanlık."
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <Link key={dept.slug} href={`/baskanliklar/${dept.slug}`}>
                <Card className="group h-full transition-all hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 inline-flex rounded-xl bg-brand-primary/10 p-3 text-brand-primary group-hover:bg-brand-primary group-hover:text-white">
                      <DeptIcon icon={dept.icon} className="h-5 w-5" />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {dept.title}
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{dept.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

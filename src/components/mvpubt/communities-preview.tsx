import Link from "next/link";
import {
  Cpu,
  Rocket,
  Users,
  GraduationCap,
  Share2,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { departments } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { MotionStagger, MotionItem } from "@/components/shared/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkedinIcon } from "@/components/shared/social-icons";

const iconMap: Record<string, React.ElementType> = {
  cpu: Cpu,
  rocket: Rocket,
  users: Users,
  "graduation-cap": GraduationCap,
  "share-2": Share2,
  calendar: Calendar,
};

function DeptIcon({ icon, className }: { icon: string; className?: string }) {
  if (icon === "linkedin") return <LinkedinIcon className={className} />;
  const Icon = iconMap[icon] || Cpu;
  return <Icon className={className} />;
}

export function CommunitiesPreview() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeader
          eyebrow="Başkanlıklar"
          title={`${departments.length} Başkanlık`}
          description="NEXRISE ekosisteminde inovasyon, girişimcilik ve büyümeyi yöneten uzman ekipler."
        />

        <MotionStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((community) => (
            <MotionItem key={community.slug}>
              <Link href={`/baskanliklar/${community.slug}`}>
                <Card className="group h-full transition-all hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5">
                  <CardHeader>
                    <div className="mb-3 inline-flex rounded-xl bg-brand-primary/10 p-3 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                      <DeptIcon icon={community.icon} className="h-5 w-5" />
                    </div>
                    <CardTitle className="flex items-center justify-between text-lg">
                      {community.title}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {community.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}

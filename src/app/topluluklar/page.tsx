import type { Metadata } from "next";
import Link from "next/link";
import { communityGroups } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SocialBrandLogo, socialBrandStyles } from "@/components/shared/social-icons";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "Topluluklar",
  description: "NEXRISE resmî kanalları — Instagram, YouTube, LinkedIn, WhatsApp Kanalı ve Topluluğu.",
  path: "/topluluklar",
});

export default function TopluluklarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Topluluklar"
        title="Resmî Kanallar & Topluluklar"
        description="NEXRISE ekosistemine katılın. Duyurular, etkinlikler ve networking için tüm kanallarımız."
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {communityGroups.map((group) => (
              <Card key={group.slug} className="transition-all hover:border-brand-primary/30 hover:shadow-lg">
                <CardHeader>
                  <div className={`mb-2 inline-flex rounded-xl p-3 ${socialBrandStyles[group.platform]}`}>
                    <SocialBrandLogo icon={group.platform} className="h-10 w-10" uid={group.slug} />
                  </div>
                  <CardTitle>{group.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-sm text-muted-foreground">{group.description}</p>
                  <Button asChild className="w-full">
                    <a href={group.href} target="_blank" rel="noopener noreferrer">
                      Katıl <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="secondary">
              <Link href="/iletisim">İletişim & Başvuru</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { getActiveSponsors, sponsorTierLabels } from "@/lib/data/sponsors";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptySection } from "@/components/shared/empty-section";
import { SponsorInquiryForm } from "@/components/forms/sponsor-inquiry-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Sponsorlar",
  description: "NEXRISE sponsorları ve kurumsal iş birliği başvurusu.",
  path: "/sponsorlar",
});

export default async function SponsorlarPage() {
  const sponsors = await getActiveSponsors();

  return (
    <>
      <PageHeader
        eyebrow="İş Birliği"
        title="Kurumsal İş Birliği"
        description={
          sponsors.length > 0
            ? "NEXRISE ekosistemine destek veren kurumlar."
            : "NEXRISE'in şu an resmî bir sponsoru bulunmamaktadır. Gelecekte iş birliği yapmak isteyen kurumlar başvurabilir."
        }
      />
      <section className="py-20">
        <Container>
          {sponsors.length === 0 ? (
            <EmptySection message="Henüz listelenecek bir sponsor veya partner yok." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sponsors.map((sponsor) => (
                <Card key={sponsor.id}>
                  <CardContent className="pt-6">
                    {sponsor.logoUrl && (
                      <div className="relative mb-4 h-14 w-36 overflow-hidden rounded bg-white p-1">
                        <Image
                          src={sponsor.logoUrl}
                          alt={`${sponsor.name} logosu`}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{sponsor.name}</h3>
                      <Badge variant="secondary">
                        {sponsorTierLabels[sponsor.tier] ?? sponsor.tier}
                      </Badge>
                    </div>
                    {sponsor.description && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {sponsor.description}
                      </p>
                    )}
                    {sponsor.websiteUrl && (
                      <a
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm text-brand-primary hover:underline"
                      >
                        Web sitesi →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
      <section id="sponsor-ol" className="border-t border-border bg-muted/30 py-20">
        <Container>
          <SectionHeader
            title="İş Birliği Başvurusu"
            description="Kurumunuz NEXRISE ekosistemiyle iş birliği yapmak istiyorsa formu doldurun."
          />
          <SponsorInquiryForm />
        </Container>
      </section>
    </>
  );
}

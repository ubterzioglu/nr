import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptySection } from "@/components/shared/empty-section";
import { SponsorInquiryForm } from "@/components/forms/sponsor-inquiry-form";

export const metadata: Metadata = pageMetadata({
  title: "Sponsorlar",
  description: "NEXRISE kurumsal iş birliği başvurusu. Henüz resmî sponsor bulunmamaktadır.",
  path: "/sponsorlar",
});

export default function SponsorlarPage() {
  return (
    <>
      <PageHeader
        eyebrow="İş Birliği"
        title="Kurumsal İş Birliği"
        description="NEXRISE'in şu an resmî bir sponsoru bulunmamaktadır. Gelecekte iş birliği yapmak isteyen kurumlar başvurabilir."
      />
      <section className="py-20">
        <Container>
          <EmptySection message="Henüz listelenecek bir sponsor veya partner yok." />
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

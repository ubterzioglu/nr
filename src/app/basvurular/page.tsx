import type { Metadata } from "next";
import { applicationTypes } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { ApplicationForm } from "@/components/forms/application-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = pageMetadata({
  title: "Başvurular",
  description: "NEXRISE yönetim, gönüllü, başkanlık, konuşmacı, sponsor ve partner başvuruları.",
  path: "/basvurular",
});

export default function BasvurularPage() {
  return (
    <>
      <PageHeader
        eyebrow="Başvurular"
        title="Başvuru Merkezi"
        description="Yönetim, gönüllülük, başkanlık, konuşmacılık, sponsorluk ve partnerlik başvurularınızı buradan iletebilirsiniz."
      />
      <section className="py-20">
        <Container>
          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {applicationTypes.map((t) => (
              <Card key={t.value}>
                <CardHeader><CardTitle className="text-lg">{t.label}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{t.description}</p></CardContent>
              </Card>
            ))}
          </div>
          <ApplicationForm />
        </Container>
      </section>
    </>
  );
}

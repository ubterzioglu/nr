import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Monitor } from "lucide-react";
import { webinars } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { EmptySection } from "@/components/shared/empty-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = pageMetadata({
  title: "Webinarlar",
  description: "NEXRISE webinarları — canlı eğitim oturumları ve kayıtlar.",
  path: "/webinarlar",
});

const statusLabels = {
  upcoming: "Yaklaşan",
  live: "Canlı Yayın",
  recorded: "Kayıt",
};

export default function WebinarlarPage() {
  const upcoming = webinars.filter((w) => w.status === "upcoming");
  const recorded = webinars.filter((w) => w.status === "recorded" || w.status === "live");

  return (
    <>
      <PageHeader
        eyebrow="Webinarlar"
        title="Webinarlar"
        description="Canlı eğitim oturumları ve kayıtlar."
      />
      <section className="py-20">
        <Container>
          {webinars.length === 0 ? (
            <EmptySection
              message="Henüz planlanmış bir webinar yok. Duyurular Instagram, YouTube ve WhatsApp Kanalımızdan paylaşılacaktır."
              actionLabel="Kanallarımız"
              actionHref="/topluluklar"
            />
          ) : (
            <>
              {upcoming.length > 0 && (
                <>
                  <h2 className="mb-8 text-2xl font-bold">Yaklaşan Webinarlar</h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {upcoming.map((webinar) => (
                      <Card key={webinar.slug}>
                        <CardHeader>
                          <Badge className="w-fit">{statusLabels[webinar.status]}</Badge>
                          <CardTitle className="mt-2">{webinar.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-sm text-muted-foreground">{webinar.description}</p>
                          <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              {new Date(webinar.date).toLocaleDateString("tr-TR")}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {webinar.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Monitor className="h-4 w-4" />
                              {webinar.platform}
                            </span>
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/webinarlar/${webinar.slug}`}>Detay</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {recorded.length > 0 && (
                <>
                  <h2 className={`mb-8 text-2xl font-bold ${upcoming.length > 0 ? "mt-16" : ""}`}>
                    Geçmiş Webinarlar & Kayıtlar
                  </h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {recorded.map((webinar) => (
                      <Card key={webinar.slug} className="opacity-90">
                        <CardHeader>
                          <Badge variant="secondary" className="w-fit">
                            {statusLabels[webinar.status]}
                          </Badge>
                          <CardTitle className="mt-2">{webinar.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-sm text-muted-foreground">{webinar.description}</p>
                          <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              {new Date(webinar.date).toLocaleDateString("tr-TR")}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {webinar.time}
                            </span>
                          </div>
                          <Button asChild variant="secondary" size="sm">
                            <Link href={`/webinarlar/${webinar.slug}`}>Detaylar</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}

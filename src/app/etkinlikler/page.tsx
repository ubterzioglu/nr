import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { events } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { EmptySection } from "@/components/shared/empty-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = pageMetadata({
  title: "Etkinlikler",
  description: "NEXRISE etkinlikleri — duyurular sosyal medya kanallarından paylaşılır.",
  path: "/etkinlikler",
});

const typeLabels: Record<string, string> = {
  summit: "Zirve",
  workshop: "Atölye",
  networking: "Networking",
  conference: "Konferans",
};

export default function EtkinliklerPage() {
  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past");

  return (
    <>
      <PageHeader
        eyebrow="Etkinlikler"
        title="Etkinlikler"
        description="Zirveler, atölyeler, konferanslar ve networking etkinlikleri."
      />
      <section className="py-20">
        <Container>
          {upcoming.length === 0 && past.length === 0 ? (
            <EmptySection
              message="Henüz kayıtlı bir etkinlik yok. Yeni etkinlikler Instagram ve WhatsApp Kanalımızdan duyurulacaktır."
              actionLabel="Topluluk Kanalları"
              actionHref="/topluluklar"
            />
          ) : (
            <>
              {upcoming.length > 0 && (
                <>
                  <h2 className="mb-8 text-2xl font-bold">Yaklaşan Etkinlikler</h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {upcoming.map((event) => (
                      <Card key={event.slug}>
                        <CardHeader>
                          <Badge className="w-fit">{typeLabels[event.type] ?? event.type}</Badge>
                          <CardTitle className="mt-2">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-sm text-muted-foreground">{event.description}</p>
                          <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(event.date).toLocaleDateString("tr-TR")}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{event.time}</span>
                            {event.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.location}</span>}
                          </div>
                          <Button asChild size="sm"><Link href={`/etkinlikler/${event.slug}`}>Detay</Link></Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
              {past.length > 0 && (
                <>
                  <h2 className="mb-8 mt-16 text-2xl font-bold">Geçmiş Etkinlikler</h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {past.map((event) => (
                      <Card key={event.slug} className="opacity-80">
                        <CardHeader><CardTitle>{event.title}</CardTitle></CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <Button asChild variant="secondary" size="sm" className="mt-4">
                            <Link href={`/etkinlikler/${event.slug}`}>Detaylar</Link>
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

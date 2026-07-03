import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { events } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptySection } from "@/components/shared/empty-section";
import { MotionDiv, MotionStagger, MotionItem } from "@/components/shared/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UpcomingEvents() {
  const upcoming = events.filter((e) => e.status === "upcoming").slice(0, 3);

  return (
    <section className="bg-muted/30 py-24 md:py-32">
      <Container>
        <SectionHeader
          eyebrow="Etkinlikler"
          title="Yaklaşan Etkinlikler"
          description="Zirveler, atölyeler, konferanslar ve networking oturumları."
        />

        {upcoming.length === 0 ? (
          <EmptySection
            message="Henüz planlanmış bir etkinlik yok. Yeni etkinlikler WhatsApp Kanalımız ve Instagram hesabımızdan duyurulacaktır."
            actionLabel="Kanallarımız"
            actionHref="/topluluklar"
          />
        ) : (
          <>
            <MotionStagger className="grid gap-6 lg:grid-cols-3">
              {upcoming.map((event) => (
                <MotionItem key={event.slug}>
                  <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit capitalize">{event.type}</Badge>
                      <CardTitle className="mt-3">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.date).toLocaleDateString("tr-TR")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </MotionItem>
              ))}
            </MotionStagger>
            <MotionDiv className="mt-10 text-center">
              <Button asChild variant="secondary">
                <Link href="/etkinlikler">Tüm Etkinlikler <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </MotionDiv>
          </>
        )}
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, MapPin, Users } from "lucide-react";
import { events } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventRegistrationForm } from "@/components/forms/event-registration-form";

type Props = { params: Promise<{ slug: string }> };

const typeLabels: Record<string, string> = {
  summit: "Zirve",
  workshop: "Atölye",
  networking: "Networking",
  conference: "Konferans",
};

export async function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) return { title: "Etkinlik" };
  return pageMetadata({
    title: event.title,
    description: event.description,
    path: `/etkinlikler/${slug}`,
  });
}

export default async function EtkinlikDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) notFound();

  return (
    <>
      <PageHeader
        eyebrow={event.status === "upcoming" ? "Yaklaşan Etkinlik" : "Geçmiş Etkinlik"}
        title={event.title}
        description={event.description}
      />
      <section className="py-20">
        <Container className="max-w-3xl">
          <Button asChild variant="secondary" size="sm" className="mb-8">
            <Link href="/etkinlikler"><ArrowLeft className="h-4 w-4" /> Tüm Etkinlikler</Link>
          </Button>
          <div className="flex flex-wrap gap-3">
            <Badge>{typeLabels[event.type] ?? event.type}</Badge>
            <Badge variant="secondary">{event.status === "upcoming" ? "Yaklaşan" : "Geçmiş"}</Badge>
          </div>
          <div className="mt-8 space-y-3 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-primary" />
              {new Date(event.date).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-primary" />
              {event.time} (TRT)
            </span>
            {event.location && (
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-primary" />
                {event.location}
              </span>
            )}
            {event.capacity && (
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-primary" />
                Kapasite: {event.capacity} kişi
              </span>
            )}
            {event.speaker && (
              <p><span className="font-medium text-foreground">Konuşmacı:</span> {event.speaker}</p>
            )}
          </div>

          {event.longDescription && (
            <p className="mt-8 leading-relaxed text-muted-foreground">{event.longDescription}</p>
          )}

          {event.status === "upcoming" && event.registrationOpen && (
            <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-8">
              <h3 className="text-xl font-semibold">Kayıt Ol</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Etkinliğe katılmak için formu doldurun.
              </p>
              <EventRegistrationForm eventSlug={event.slug} />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

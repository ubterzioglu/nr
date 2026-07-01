import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Monitor, Users } from "lucide-react";
import { webinars } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventRegistrationForm } from "@/components/forms/event-registration-form";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return webinars.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const webinar = webinars.find((w) => w.slug === slug);
  if (!webinar) return { title: "Webinar" };
  return pageMetadata({
    title: webinar.title,
    description: webinar.description,
    path: `/webinarlar/${slug}`,
  });
}

const statusLabel = {
  upcoming: "Yaklaşan",
  live: "Canlı Yayın",
  recorded: "Kayıt",
};

export default async function WebinarDetailPage({ params }: Props) {
  const { slug } = await params;
  const webinar = webinars.find((w) => w.slug === slug);
  if (!webinar) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Webinar"
        title={webinar.title}
        description={webinar.description}
      />
      <section className="py-20">
        <Container className="max-w-3xl">
          <Button asChild variant="secondary" size="sm" className="mb-8">
            <Link href="/webinarlar"><ArrowLeft className="h-4 w-4" /> Tüm Webinarlar</Link>
          </Button>

          <div className="flex flex-wrap gap-2">
            <Badge>{statusLabel[webinar.status]}</Badge>
            <Badge variant="secondary">{webinar.platform}</Badge>
            <Badge variant="outline">{webinar.duration}</Badge>
          </div>

          <div className="mt-8 space-y-3 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-primary" />
              {new Date(webinar.date).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-primary" />
              {webinar.time} (TRT)
            </span>
            <span className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-brand-primary" />
              Konuşmacı: {webinar.speaker}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-primary" />
              Platform: {webinar.platform}
            </span>
          </div>

          <p className="mt-8 leading-relaxed text-muted-foreground">{webinar.longDescription}</p>

          <h3 className="mb-4 mt-10 text-lg font-semibold">Konu Başlıkları</h3>
          <div className="flex flex-wrap gap-2">
            {webinar.topics.map((topic) => (
              <Badge key={topic} variant="secondary">{topic}</Badge>
            ))}
          </div>

          {webinar.registrationOpen && webinar.status === "upcoming" && (
            <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-8">
              <h3 className="text-xl font-semibold">Webinara Kayıt Ol</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Kayıt formunu doldurarak webinar linkini e-posta ile alacaksınız.
              </p>
              <EventRegistrationForm eventSlug={webinar.slug} />
            </div>
          )}

          {webinar.status === "recorded" && (
            <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-8">
              <p className="text-muted-foreground">Bu webinar kayıt altındadır. YouTube kanalımızdan izleyebilirsiniz.</p>
              <Button asChild className="mt-4">
                <a href="https://youtube.com/@nexriseoffical" target="_blank" rel="noopener noreferrer">YouTube&apos;da İzle</a>
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

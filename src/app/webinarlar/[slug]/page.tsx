import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Monitor, Users } from "lucide-react";
import { getWebinarBySlug } from "@/lib/data/webinars";
import { isRegistrationFull } from "@/lib/data/registrations";
import { getCurrentUser } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventRegistrationForm } from "@/components/forms/event-registration-form";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getWebinarBySlug(slug);
  if (!detail) return { title: "Webinar" };
  return pageMetadata({
    title: detail.webinar.title,
    description: detail.webinar.description,
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
  const detail = await getWebinarBySlug(slug);
  if (!detail) notFound();

  const { webinar, dbId } = detail;
  const [capacityFull, currentUser] = await Promise.all([
    isRegistrationFull("webinar", dbId, webinar.capacity),
    getCurrentUser(),
  ]);

  const member =
    currentUser?.authUser.email
      ? {
          fullName: currentUser.profile?.full_name ?? currentUser.authUser.email,
          email: currentUser.authUser.email,
        }
      : null;

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
            {webinar.duration && <Badge variant="outline">{webinar.duration}</Badge>}
            {capacityFull && <Badge variant="secondary">Kontenjan Doldu</Badge>}
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

          {webinar.longDescription && (
            <p className="mt-8 leading-relaxed text-muted-foreground">{webinar.longDescription}</p>
          )}

          {webinar.topics.length > 0 && (
            <>
              <h3 className="mb-4 mt-10 text-lg font-semibold">Konu Başlıkları</h3>
              <div className="flex flex-wrap gap-2">
                {webinar.topics.map((topic) => (
                  <Badge key={topic} variant="secondary">{topic}</Badge>
                ))}
              </div>
            </>
          )}

          {webinar.registrationOpen && webinar.status === "upcoming" && (
            <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-8">
              <h3 className="text-xl font-semibold">Webinara Kayıt Ol</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {member
                  ? "Üye hesabınla tek tıkla katıl; webinar linki e-posta ile gönderilir."
                  : "Kayıt formunu doldurarak webinar linkini e-posta ile alacaksınız."}
              </p>
              <EventRegistrationForm
                targetType="webinar"
                slug={webinar.slug}
                capacityFull={capacityFull}
                member={member}
              />
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

import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { webinars } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptySection } from "@/components/shared/empty-section";
import { MotionStagger, MotionItem } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";

export function FeaturedWebinars() {
  const upcoming = webinars.filter((w) => w.status === "upcoming");
  const featured =
    upcoming.length > 0
      ? upcoming.slice(0, 2)
      : [...webinars]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 2);

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeader
          eyebrow="Webinarlar"
          title="Webinarlar"
          description="Canlı eğitim oturumları ve kayıtlar."
        />

        {featured.length === 0 ? (
          <EmptySection
            message="Henüz planlanmış bir webinar yok. Duyurular sosyal medya kanallarımızdan paylaşılacaktır."
            actionLabel="Webinarlar Sayfası"
            actionHref="/webinarlar"
          />
        ) : (
          <>
            <MotionStagger className="grid gap-6 lg:grid-cols-2">
              {featured.map((webinar) => (
                <MotionItem key={webinar.slug}>
                  <Link href={`/webinarlar/${webinar.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-brand-primary/30 hover:shadow-lg">
                      <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white">
                          <Play className="h-7 w-7 fill-current" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold group-hover:text-brand-primary">{webinar.title}</h3>
                          <p className="mt-2 text-sm text-muted-foreground">{webinar.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </MotionItem>
              ))}
            </MotionStagger>
            <div className="mt-10 text-center">
              <Button asChild variant="secondary">
                <Link href="/webinarlar">Tüm Webinarlar <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}

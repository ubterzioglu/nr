import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { brand, social, joinMessage } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { SocialLinkCard } from "@/components/shared/social-link-card";
import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = pageMetadata({
  title: "İletişim",
  description: "NEXRISE ile sosyal medya kanallarımız üzerinden iletişime geçin.",
  path: "/iletisim",
});

export default function IletisimPage() {
  return (
    <>
      <PageHeader eyebrow="İletişim" title={joinMessage.title} description={joinMessage.description} />
      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Card className="border-brand-primary/20 bg-brand-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <MessageCircle className="h-5 w-5 text-brand-primary" />
                    Bize Ulaşın
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{brand.contactNote}</p>
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/topluluklar">Tüm Kanalları Gör</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Sosyal Medya</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {social.map((link) => (
                    <SocialLinkCard
                      key={link.name}
                      href={link.href}
                      label={link.label}
                      subtitle={link.subtitle}
                      icon={link.icon}
                      className="border-0 bg-muted/30 p-4 hover:bg-muted/50"
                    />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <MapPin className="h-5 w-5 text-brand-primary" />
                    Konum
                  </CardTitle>
                </CardHeader>
                <CardContent><p className="text-muted-foreground">{brand.location}</p></CardContent>
              </Card>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-xl font-semibold">Web Formu</h2>
              <p className="mt-2 mb-6 text-sm text-muted-foreground">
                Formu doldurarak da bize ulaşabilirsiniz. En hızlı yanıt için sosyal medya kanallarımızı tercih edin.
              </p>
              <ContactForm />
            </div>
          </div>
          <p className="mx-auto mt-16 max-w-3xl text-center text-muted-foreground">{joinMessage.footer}</p>
        </Container>
      </section>
    </>
  );
}

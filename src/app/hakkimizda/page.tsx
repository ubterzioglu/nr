import type { Metadata } from "next";
import Link from "next/link";
import { brand, mission, vision, values, brandValues } from "@/config/site";
import {
  aboutContent,
  storyContent,
  whatNexriseDoes,
} from "@/config/content";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { MotionDiv } from "@/components/shared/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "Hakkımızda",
  description: `${brand.name} — teknoloji ve girişimcilik ekosistemi. Ne yapıyoruz, neden kurulduk, kime hitap ediyoruz.`,
  path: "/hakkimizda",
});

export default function HakkimizdaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hakkımızda"
        title={aboutContent.whatIs.title}
        description={brand.description}
      />

      <section className="py-20">
        <Container>
          <SectionHeader align="left" eyebrow="Kurumsal" title={aboutContent.whatIs.title} />
          <MotionDiv className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted-foreground">
            {aboutContent.whatIs.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </MotionDiv>
        </Container>
      </section>

      <section className="bg-muted/30 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader align="left" title={aboutContent.whatWeDo.title} />
              <ul className="space-y-3">
                {aboutContent.whatWeDo.items.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader align="left" title={aboutContent.audience.title} />
              <ul className="space-y-3">
                {aboutContent.audience.items.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>{aboutContent.whyFounded.title}</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                {aboutContent.whyFounded.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{aboutContent.problem.title}</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                {aboutContent.problem.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section id="hikaye" className="bg-muted/30 py-20">
        <Container>
          <SectionHeader align="left" eyebrow="Hikâyemiz" title={storyContent.title} />
          <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted-foreground">
            {storyContent.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p className="font-medium text-foreground">{storyContent.goal}</p>
          </div>
        </Container>
      </section>

      <section id="misyon" className="py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Vizyon</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-lg text-muted-foreground">
                {vision.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Misyon</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-lg text-muted-foreground">
                {mission.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section id="degerler" className="bg-muted/30 py-20">
        <Container>
          <SectionHeader eyebrow="Değerler" title="Temel Değerler" description="El kitabımızda tanımlanan çalışma ilkeleri." />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {values.map((v) => (
              <div key={v} className="rounded-2xl border border-border bg-card p-6 text-center font-semibold">
                {v}
              </div>
            ))}
          </div>
          <div className="mt-16">
            <SectionHeader eyebrow="Marka" title="Marka Değerleri" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {brandValues.map((v) => (
                <div key={v} className="rounded-2xl border border-border bg-muted/30 p-6 text-center text-sm font-medium">
                  {v}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeader eyebrow="Sloganlar" title="Marka Sloganları" />
          <div className="mb-6 rounded-2xl border border-brand-primary/30 bg-brand-primary/5 p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary">Ana Slogan</p>
            <p className="mt-2 text-2xl font-bold">{brand.slogan}</p>
            <p className="mt-2 text-muted-foreground">{brand.tagline}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {brand.subSlogans.map((s) => (
              <div key={s} className="rounded-xl border border-border bg-card px-6 py-4 text-center text-sm font-medium text-muted-foreground">
                {s}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-muted/30 py-20">
        <Container>
          <SectionHeader title="NEXRISE Ne Yapıyor?" description="Ekosistemimizin sunduğu faaliyetler." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {whatNexriseDoes.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-primary" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/baskanliklar">Başkanlıklar <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/yonetim">Yönetim Kadrosu <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mission, vision } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { MotionDiv } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";

export function AboutPreview() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeader
          eyebrow="Hakkımızda"
          title="Profesyonel Bir Teknoloji Ekosistemi"
          description="Öğrenciler, girişimciler, yazılımcılar, startup kurucuları, profesyoneller, mentorlar ve şirketleri bir araya getiren bağımsız platform."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <MotionDiv>
            <div className="rounded-2xl border border-border bg-card p-8 glow-primary">
              <h3 className="text-xl font-semibold">Misyonumuz</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{mission[0]}</p>
            </div>
          </MotionDiv>
          <MotionDiv delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="text-xl font-semibold">Vizyonumuz</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{vision[0]}</p>
            </div>
          </MotionDiv>
        </div>

        <MotionDiv delay={0.2} className="mt-10 text-center">
          <Button asChild variant="secondary">
            <Link href="/hakkimizda">
              Daha Fazla Bilgi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </MotionDiv>
      </Container>
    </section>
  );
}

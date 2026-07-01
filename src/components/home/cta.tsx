import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { joinMessage } from "@/config/site";
import { Container } from "@/components/shared/container";
import { MotionDiv } from "@/components/shared/motion";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <MotionDiv>
          <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-8 py-16 text-center text-white md:px-16 md:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(29,111,255,0.3),transparent_60%)]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {joinMessage.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-300">
                {joinMessage.description}
              </p>
              <p className="mt-4 text-sm text-brand-accent">
                {joinMessage.footer}
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg">
                  <Link href="/iletisim">
                    Topluluğa Katıl
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/basvurular">Başvuru Yap</Link>
                </Button>
              </div>
            </div>
          </div>
        </MotionDiv>
      </Container>
    </section>
  );
}

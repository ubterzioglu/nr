import { Container } from "@/components/shared/container";
import { MotionDiv } from "@/components/shared/motion";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="hero-gradient border-b border-white/5 pt-32 pb-16 text-white">
      <Container>
        <MotionDiv className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          {description && (
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              {description}
            </p>
          )}
        </MotionDiv>
      </Container>
    </section>
  );
}

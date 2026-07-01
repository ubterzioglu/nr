"use client";

import { stats } from "@/config/site";
import { Container } from "@/components/shared/container";
import { MotionDiv, MotionStagger, MotionItem } from "@/components/shared/motion";

export function Statistics() {
  return (
    <section className="border-y border-border bg-muted/50 py-20">
      <Container>
        <MotionStagger className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <MotionItem key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-brand-primary md:text-5xl lg:text-6xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}

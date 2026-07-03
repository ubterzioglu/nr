import Link from "next/link";
import { social, joinMessage } from "@/config/site";
import type { SocialLink } from "@/types";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { SocialLinkCard } from "@/components/shared/social-link-card";
import { MotionStagger, MotionItem } from "@/components/shared/motion";

/** links verilmezse config'teki sosyal bağlantılar kullanılır. */
export function SocialFollow({ links = social }: { links?: SocialLink[] }) {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeader
          eyebrow="Takip Et"
          title={joinMessage.title}
          description={joinMessage.description}
        />
        <MotionStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <MotionItem key={link.name}>
              <SocialLinkCard
                href={link.href}
                label={link.label}
                subtitle={link.subtitle}
                icon={link.icon}
                size="lg"
              />
            </MotionItem>
          ))}
        </MotionStagger>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          {joinMessage.footer}{" "}
          <Link href="/topluluklar" className="text-brand-primary hover:underline">
            Tüm topluluklar →
          </Link>
        </p>
      </Container>
    </section>
  );
}

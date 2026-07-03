"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { brand } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export interface HeroContent {
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

/** İçerik verilmezse config varsayılanları kullanılır (admin ayarları boşken). */
export function Hero({ content }: { content?: Partial<HeroContent> }) {
  const title = content?.title ?? brand.slogan;
  const description = content?.description ?? brand.description;
  const primaryCtaLabel = content?.primaryCtaLabel ?? "Topluluğa Katıl";
  const primaryCtaHref = content?.primaryCtaHref ?? "/basvurular";
  const secondaryCtaLabel = content?.secondaryCtaLabel ?? "Etkinlikleri Keşfet";
  const secondaryCtaHref = content?.secondaryCtaHref ?? "/etkinlikler";

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React SSR çıktısına muted attribute'u yazmadığı için autoplay
    // hidrasyon öncesi engellenebilir; burada elle tetiklenir.
    video.muted = true;
    video.play().catch(() => {
      // Autoplay engellenirse poster + hero-gradient görünür kalır.
    });
  }, []);

  return (
    <section className="hero-gradient relative min-h-screen overflow-hidden pt-28 text-white">
      <div aria-hidden="true" className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-70 motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero-abstract-poster.jpg"
        >
          <source src="/videos/hero-abstract.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/30 to-[#0a1228]" />
      </div>

      <Container className="relative flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center pb-24 text-center lg:items-start lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <div className="mb-10 flex justify-center lg:mb-12 lg:justify-start">
            <Logo size="xl" />
          </div>

          <h1 className="text-3xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-gradient">{title}</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            {description}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg" className="h-12">
              <Link href={primaryCtaHref}>
                {primaryCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12">
              <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
            </Button>
          </div>
        </motion.div>

      </Container>
    </section>
  );
}

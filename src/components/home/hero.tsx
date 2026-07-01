"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { brand } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="hero-gradient relative min-h-screen overflow-hidden pt-28 text-white">
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
            <span className="text-gradient">{brand.slogan}</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            {brand.description}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg" className="h-12">
              <Link href="/basvurular">
                Topluluğa Katıl
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12">
              <Link href="/etkinlikler">Etkinlikleri Keşfet</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
        >
          <div className="h-12 w-6 rounded-full border border-white/20 p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mx-auto h-2 w-2 rounded-full bg-brand-accent"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

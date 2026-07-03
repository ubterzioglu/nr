"use client";

import { motion, useReducedMotion } from "framer-motion";
import { brand, communityGroups } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { SocialBrandLogo } from "@/components/shared/social-icons";
import { cn } from "@/lib/utils";

type ComingSoonProps = {
  /** Display font (Space Grotesk) — page tarafında next/font ile yüklenir */
  displayClassName?: string;
};

const rise = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/** Sabit koordinatlı yıldız noktaları — deterministik, hydration-safe */
const stars = [
  { top: "12%", left: "18%", size: 2, opacity: 0.5 },
  { top: "8%", left: "62%", size: 1.5, opacity: 0.35 },
  { top: "22%", left: "80%", size: 2, opacity: 0.45 },
  { top: "30%", left: "8%", size: 1.5, opacity: 0.3 },
  { top: "16%", left: "40%", size: 1.5, opacity: 0.25 },
  { top: "38%", left: "90%", size: 1.5, opacity: 0.35 },
  { top: "45%", left: "14%", size: 2, opacity: 0.3 },
  { top: "6%", left: "88%", size: 1.5, opacity: 0.4 },
];

export function ComingSoon({ displayClassName }: ComingSoonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#050B1A] text-white">
      {/* Atmosfer: yıldızlar + yükselen ufuk ışıması ("Rise") */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#5CC8FF]"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}

        <motion.div
          className="absolute left-1/2 top-[62%] h-[120vh] w-[170vw] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 50% 42% at 50% 38%, rgba(29,111,255,0.5), rgba(42,167,255,0.16) 48%, rgba(5,11,26,0) 72%)",
          }}
          initial={reduceMotion ? false : { y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="absolute left-1/2 top-[68%] h-[200vh] w-[220vw] -translate-x-1/2 rounded-[50%] border-t border-[#5CC8FF]/25 shadow-[0_-24px_80px_-12px_rgba(92,200,255,0.35)]"
          initial={reduceMotion ? false : { y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <motion.div
        className="relative flex min-h-full flex-col items-center justify-center px-6 pb-28 pt-16 text-center"
        initial={reduceMotion ? undefined : "hidden"}
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } }}
      >
        <motion.div variants={rise}>
          <Logo size="lg" />
        </motion.div>

        <motion.p
          variants={rise}
          className="mt-10 text-[0.7rem] font-medium uppercase tracking-[0.4em] text-[#5CC8FF] md:text-xs"
        >
          {brand.slogan}
        </motion.p>

        <motion.h1
          variants={rise}
          className={cn(
            "mt-5 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl",
            displayClassName
          )}
        >
          Yeni nesil
          <br />
          <span className="text-[#2AA7FF]">yükseliyor.</span>
        </motion.h1>

        <motion.p variants={rise} className="mt-7 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
          NEXRISE; teknoloji, girişimcilik ve inovasyonu aynı çatı altında buluşturan bağımsız
          gençlik ekosistemi. Türkiye&apos;nin 81 ilinden gençlerle çok yakında yayındayız.
        </motion.p>

        <motion.div
          variants={rise}
          className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5CC8FF] opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2AA7FF]" />
          </span>
          Hazırlıklar sürüyor — çok yakında
        </motion.div>

        <motion.div variants={rise} className="mt-12">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Yayına kadar buradayız</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {communityGroups.map((group) => (
              <a
                key={group.slug}
                href={group.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={group.title}
                title={group.title}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#2AA7FF]/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CC8FF] motion-reduce:hover:translate-y-0"
              >
                <SocialBrandLogo icon={group.platform} uid={`coming-soon-${group.slug}`} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.p
        className="absolute inset-x-0 bottom-7 text-center text-xs text-white/35"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        {brand.location} · © NEXRISE — {brand.tagline}
      </motion.p>
    </div>
  );
}

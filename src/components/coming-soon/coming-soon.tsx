"use client";

import { motion, useReducedMotion } from "framer-motion";
import { brand, communityGroups } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { SocialBrandLogo, SocialIcon } from "@/components/shared/social-icons";
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

/**
 * Sabit koordinatlı yıldızlar — deterministik, hydration-safe.
 * duration/delay değerleri göz kırpmayı (cs-twinkle) desenkronize eder.
 */
const stars = [
  { top: "12%", left: "18%", size: 2, opacity: 0.5, duration: 4.2, delay: 0 },
  { top: "8%", left: "62%", size: 1.5, opacity: 0.35, duration: 5.6, delay: 1.2 },
  { top: "22%", left: "80%", size: 2, opacity: 0.45, duration: 3.6, delay: 2.1 },
  { top: "30%", left: "8%", size: 1.5, opacity: 0.3, duration: 6.4, delay: 0.6 },
  { top: "16%", left: "40%", size: 1.5, opacity: 0.25, duration: 4.8, delay: 2.8 },
  { top: "38%", left: "90%", size: 1.5, opacity: 0.35, duration: 5.2, delay: 1.7 },
  { top: "45%", left: "14%", size: 2, opacity: 0.3, duration: 3.9, delay: 3.4 },
  { top: "6%", left: "88%", size: 1.5, opacity: 0.4, duration: 6.1, delay: 0.9 },
];

/**
 * Ufuktan yükselen ışık zerreleri ("Rise" imzası) — deterministik.
 * Negatif delay her zerreyi döngünün farklı bir anından başlatır.
 */
const motes = [
  { left: "22%", size: 3, duration: 18, delay: -4, maxOpacity: 0.4 },
  { left: "35%", size: 2, duration: 24, delay: -12, maxOpacity: 0.3 },
  { left: "47%", size: 3.5, duration: 16, delay: -7, maxOpacity: 0.45 },
  { left: "55%", size: 2, duration: 26, delay: -19, maxOpacity: 0.28 },
  { left: "64%", size: 3, duration: 20, delay: -2, maxOpacity: 0.4 },
  { left: "76%", size: 2.5, duration: 22, delay: -15, maxOpacity: 0.32 },
  { left: "86%", size: 2, duration: 19, delay: -9, maxOpacity: 0.26 },
];

export function ComingSoon({ displayClassName }: ComingSoonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#050B1A] text-white">
      {/* Atmosfer: göz kırpan yıldızlar + nefes alan ufuk + yükselen ışık zerreleri */}
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
              ...(reduceMotion
                ? {}
                : ({
                    "--star-max": String(star.opacity),
                    animation: `cs-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                  } as React.CSSProperties)),
            }}
          />
        ))}

        {/* Ufuktan yükselen zerreler — yalnızca hareket tercihi açıkken */}
        {!reduceMotion &&
          motes.map((mote, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-[#5CC8FF] blur-[1px]"
              style={{
                top: "66%",
                left: mote.left,
                width: mote.size,
                height: mote.size,
                opacity: 0,
                ...({
                  "--mote-max": String(mote.maxOpacity),
                  animation: `cs-mote ${mote.duration}s linear ${mote.delay}s infinite`,
                } as React.CSSProperties),
              }}
            />
          ))}

        {/* Ufuk ışıması: giriş animasyonu + sürekli nefes alma */}
        <motion.div
          className="absolute left-1/2 top-[62%] h-[120vh] w-[170vw] -translate-x-1/2"
          initial={reduceMotion ? false : { y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(ellipse 50% 42% at 50% 38%, rgba(29,111,255,0.5), rgba(42,167,255,0.16) 48%, rgba(5,11,26,0) 72%)",
            }}
            animate={
              reduceMotion
                ? undefined
                : { scale: [1, 1.05, 1], opacity: [1, 0.85, 1] }
            }
            transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
          />
        </motion.div>
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
                className="group relative rounded-2xl bg-gradient-to-b from-white/15 to-white/[0.03] p-px transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CC8FF] motion-reduce:hover:translate-y-0"
              >
                {/* Hover halo — marka mavisi */}
                <span
                  aria-hidden
                  className="absolute -inset-1.5 rounded-[20px] bg-[#1D6FFF]/30 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-[15px] bg-[#0A1326]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-[#0D1B33]/90 group-hover:ring-[#2AA7FF]/40">
                  {/* Sakin durum: monokrom ikon */}
                  <SocialIcon
                    icon={group.platform}
                    className="absolute h-5 w-5 scale-100 text-white/60 transition-all duration-300 group-hover:scale-90 group-hover:opacity-0"
                  />
                  {/* Hover: resmî marka rengi belirir */}
                  <SocialBrandLogo
                    icon={group.platform}
                    uid={`coming-soon-${group.slug}`}
                    className="h-5 w-5 scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                  />
                </span>
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

import { Sparkles } from "lucide-react";

/** Ana sayfa için BETA uyarı bandı — sayfanın en üstünde durur */
export function BetaBanner() {
  return (
    <div className="bg-background pt-16">
      <div
        className="border-y border-brand-accent/40 bg-brand-accent/10 px-4 py-2.5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 14px, rgba(92,200,255,0.08) 14px 28px)",
        }}
      >
        <p className="flex items-center justify-center gap-2 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-accent md:text-xs">
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Beta Sürümü — Platformu geliştiriyoruz, geri bildirimlerin bizim için değerli
        </p>
      </div>
    </div>
  );
}

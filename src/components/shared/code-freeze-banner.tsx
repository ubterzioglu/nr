import { Lock } from "lucide-react";

/** /mvp route'u için code-freeze uyarı bandı — sayfanın en üstünde durur */
export function CodeFreezeBanner() {
  return (
    <div className="bg-background pt-16">
      <div
        className="border-y border-amber-500/40 bg-amber-500/10 px-4 py-2.5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 14px, rgba(245,158,11,0.08) 14px 28px)",
        }}
      >
        <p className="flex items-center justify-center gap-2 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-amber-500 md:text-xs">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Code Freeze — Bu sayfa dondurulmuştur, üzerinde değişiklik yapılmayacaktır
        </p>
      </div>
    </div>
  );
}

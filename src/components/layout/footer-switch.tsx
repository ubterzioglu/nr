"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { SiteFooter } from "@/components/layout/site-footer";

/** /mvp code-freeze: eski footer orada birebir korunur, diğer tüm rotalar yeni footer'ı alır. */
export function FooterSwitch() {
  const pathname = usePathname();
  return pathname === "/mvp" ? <Footer /> : <SiteFooter />;
}

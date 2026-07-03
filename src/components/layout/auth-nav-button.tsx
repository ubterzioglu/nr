"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAuthBrowserClient } from "@/lib/supabase/browser";

/**
 * Navbar oturum düğmesi: girişli üyeye "Profilim", misafire "Giriş Yap".
 * Sayfaları dinamikleştirmemek için oturum tarayıcıda okunur.
 */
const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function AuthNavButton() {
  const [state, setState] = useState<"loading" | "guest" | "member">(
    supabaseConfigured ? "loading" : "guest"
  );

  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = createAuthBrowserClient();
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setState(data.user ? "member" : "guest");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return <span className="ml-1 h-9 w-20" aria-hidden="true" />;
  }

  if (state === "member") {
    return (
      <Button asChild size="sm" variant="outline" className="ml-1 gap-1.5">
        <Link href="/profil">
          <UserRound className="h-4 w-4" />
          Profilim
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild size="sm" variant="outline" className="ml-1">
      <Link href="/giris">Giriş Yap</Link>
    </Button>
  );
}

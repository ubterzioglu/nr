"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Mockup üye girişi formu — üyelik sistemi henüz aktif değil.
 * Gerçek kimlik doğrulama bağlanana kadar bilgilendirme mesajı gösterir.
 */
export function MemberLoginForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Üye Girişi</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        NEXRISE üye hesabınla giriş yap.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="member-email" className="mb-1.5 block text-sm font-medium">
            E-posta
          </label>
          <Input
            id="member-email"
            name="email"
            type="email"
            placeholder="ornek@eposta.com"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label htmlFor="member-password" className="mb-1.5 block text-sm font-medium">
            Şifre
          </label>
          <Input
            id="member-password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        {submitted && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-3.5 text-sm"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
            <span>
              Üyelik sistemi henüz aktif değil — çok yakında! O zamana kadar
              topluluğa başvuru formu üzerinden katılabilirsin.
            </span>
          </div>
        )}

        <Button type="submit" className="w-full">
          Giriş Yap
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Henüz üye değil misin?{" "}
        <Link
          href="/basvurular"
          className="inline-flex items-center gap-1 font-medium text-brand-primary hover:underline"
        >
          Topluluğa başvur
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>
    </>
  );
}

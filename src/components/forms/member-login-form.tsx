"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/actions";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import { GoogleAuthButton } from "@/components/forms/google-auth-button";

export type LoginNotice = "verified" | "verify-error" | "password-updated";

const noticeContent: Record<LoginNotice, { tone: "success" | "error"; text: string }> = {
  verified: {
    tone: "success",
    text: "E-posta adresin doğrulandı. Artık giriş yapabilirsin.",
  },
  "verify-error": {
    tone: "error",
    text: "Doğrulama bağlantısı geçersiz veya süresi dolmuş. Lütfen tekrar dene.",
  },
  "password-updated": {
    tone: "success",
    text: "Şifren güncellendi. Yeni şifrenle giriş yapabilirsin.",
  },
};

export function MemberLoginForm({ notice }: { notice?: LoginNotice }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(data: SignInFormData) {
    setServerError(null);
    const result = await signIn(data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    router.push("/");
    router.refresh();
  }

  const activeNotice = notice ? noticeContent[notice] : null;

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Üye Girişi</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        NEXRISE üye hesabınla giriş yap.
      </p>

      {activeNotice && (
        <div
          role="status"
          className={
            activeNotice.tone === "success"
              ? "mt-4 flex items-start gap-2.5 rounded-xl border border-brand-success/20 bg-brand-success/5 p-3.5 text-sm"
              : "mt-4 flex items-start gap-2.5 rounded-xl border border-brand-error/20 bg-brand-error/5 p-3.5 text-sm"
          }
        >
          {activeNotice.tone === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-success" />
          ) : (
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-error" />
          )}
          <span>{activeNotice.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label htmlFor="member-email" className="mb-1.5 block text-sm font-medium">
            E-posta
          </label>
          <Input
            id="member-email"
            type="email"
            placeholder="ornek@eposta.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>
          )}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="member-password" className="block text-sm font-medium">
              Şifre
            </label>
            <Link
              href="/sifre-sifirla"
              className="text-xs text-brand-primary hover:underline"
            >
              Şifremi unuttum
            </Link>
          </div>
          <Input
            id="member-password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-brand-error">{errors.password.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-brand-error">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        veya
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton label="Google ile giriş yap" />

      <p className="mt-6 text-sm text-muted-foreground">
        Henüz üye değil misin?{" "}
        <Link
          href="/kayit"
          className="inline-flex items-center gap-1 font-medium text-brand-primary hover:underline"
        >
          Hesap oluştur
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>
    </>
  );
}

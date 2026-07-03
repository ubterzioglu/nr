"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestPasswordReset, updatePassword } from "@/lib/auth/actions";
import {
  resetRequestSchema,
  newPasswordSchema,
  type ResetRequestFormData,
  type NewPasswordFormData,
} from "@/lib/validations/auth";

/** Adım 1: e-postaya sıfırlama bağlantısı gönderir. */
export function ResetRequestForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetRequestFormData>({ resolver: zodResolver(resetRequestSchema) });

  async function onSubmit(data: ResetRequestFormData) {
    setServerError(null);
    const result = await requestPasswordReset(data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div role="status" className="text-center">
        <MailCheck className="mx-auto h-10 w-10 text-brand-primary" />
        <h1 className="mt-4 text-xl font-semibold tracking-tight">
          Bağlantı gönderildi
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Bu e-posta ile kayıtlı bir hesap varsa şifre sıfırlama bağlantısı
          gönderdik. Gelen kutunu kontrol et.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/giris">Giriş sayfasına dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Şifre Sıfırlama</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Hesabına bağlı e-posta adresini gir; sana sıfırlama bağlantısı gönderelim.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium">
            E-posta
          </label>
          <Input
            id="reset-email"
            type="email"
            placeholder="ornek@eposta.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-brand-error">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Şifreni hatırladın mı?{" "}
        <Link
          href="/giris"
          className="inline-flex items-center gap-1 font-medium text-brand-primary hover:underline"
        >
          Giriş yap
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>
    </>
  );
}

/** Adım 2: e-postadaki bağlantıyla gelen oturumda yeni şifre belirler. */
export function NewPasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormData>({ resolver: zodResolver(newPasswordSchema) });

  async function onSubmit(data: NewPasswordFormData) {
    setServerError(null);
    const result = await updatePassword(data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    router.push("/giris?sifre=yenilendi");
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Yeni Şifre Belirle</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Hesabın için yeni bir şifre oluştur.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium">
            Yeni Şifre
          </label>
          <Input
            id="new-password"
            type="password"
            placeholder="En az 8 karakter"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-brand-error">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="new-password-confirm"
            className="mb-1.5 block text-sm font-medium"
          >
            Yeni Şifre (Tekrar)
          </label>
          <Input
            id="new-password-confirm"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("passwordConfirm")}
          />
          {errors.passwordConfirm && (
            <p className="mt-1 text-sm text-brand-error">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        {serverError && <p className="text-sm text-brand-error">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </Button>
      </form>
    </>
  );
}

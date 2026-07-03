"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth/actions";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { GoogleAuthButton } from "@/components/forms/google-auth-button";
import { KvkkConsentField } from "@/components/forms/kvkk-consent";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { kvkkConsent: false },
  });

  async function onSubmit(data: SignUpFormData) {
    setServerError(null);
    const result = await signUp(data);
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
          Doğrulama maili gönderildi
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          E-posta adresine bir doğrulama bağlantısı gönderdik. Gelen kutunu
          (gerekirse spam klasörünü) kontrol edip bağlantıya tıkladıktan sonra
          giriş yapabilirsin.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/giris">Giriş sayfasına dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Hesap Oluştur</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        NEXRISE topluluğuna katıl; etkinlik kayıtlarını ve sertifikalarını tek
        yerden yönet.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label htmlFor="register-name" className="mb-1.5 block text-sm font-medium">
            Ad Soyad
          </label>
          <Input
            id="register-name"
            placeholder="Adınız Soyadınız"
            autoComplete="name"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-brand-error">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="register-email" className="mb-1.5 block text-sm font-medium">
            E-posta
          </label>
          <Input
            id="register-email"
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
          <label htmlFor="register-password" className="mb-1.5 block text-sm font-medium">
            Şifre
          </label>
          <Input
            id="register-password"
            type="password"
            placeholder="En az 8 karakter"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-brand-error">{errors.password.message}</p>
          )}
        </div>

        <KvkkConsentField
          id="register-kvkk"
          registration={register("kvkkConsent")}
          error={errors.kvkkConsent?.message}
        />

        {serverError && <p className="text-sm text-brand-error">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        veya
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton label="Google ile kayıt ol" />

      <p className="mt-6 text-sm text-muted-foreground">
        Zaten hesabın var mı?{" "}
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

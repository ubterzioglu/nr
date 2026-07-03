"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSignIn, loginAdmin } from "@/lib/admin/session";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminLoginFormProps {
  /** Supabase Auth yapılandırılmışsa e-posta/şifre formu gösterilir. */
  supabaseEnabled: boolean;
  /** Geçiş dönemi: ortak yönetici şifresi girişi hâlâ açık mı? */
  legacyEnabled: boolean;
}

export function AdminLoginForm({ supabaseEnabled, legacyEnabled }: AdminLoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [legacyMode, setLegacyMode] = useState(!supabaseEnabled);
  const [legacyLoading, setLegacyLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({ resolver: zodResolver(signInSchema) });

  function onSuccess() {
    router.push("/admin");
    router.refresh();
  }

  async function onSubmit(data: SignInFormData) {
    setServerError(null);
    const result = await adminSignIn(data);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    onSuccess();
  }

  async function handleLegacySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    setLegacyLoading(true);
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const result = await loginAdmin(password);
    if (!result.success) {
      setServerError(result.error);
      setLegacyLoading(false);
      return;
    }
    onSuccess();
  }

  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight">Admin Girişi</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {legacyMode
          ? "Yönetim paneline erişmek için yönetici şifresini girin."
          : "Yönetici hesabınla giriş yap."}
      </p>

      {!legacyMode && supabaseEnabled && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium">
              E-posta
            </label>
            <Input
              id="admin-email"
              type="email"
              placeholder="ornek@eposta.com"
              autoComplete="email"
              autoFocus
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">
              Şifre
            </label>
            <Input
              id="admin-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-brand-error">{errors.password.message}</p>
            )}
          </div>
          {serverError && (
            <p role="alert" className="text-sm text-brand-error">
              {serverError}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
      )}

      {legacyMode && (
        <form onSubmit={handleLegacySubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="admin-legacy-password"
              className="mb-1.5 block text-sm font-medium"
            >
              Yönetici Şifresi
            </label>
            <Input
              id="admin-legacy-password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              autoFocus
              required
            />
          </div>
          {serverError && (
            <p role="alert" className="text-sm text-brand-error">
              {serverError}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={legacyLoading}>
            {legacyLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
      )}

      {supabaseEnabled && legacyEnabled && (
        <button
          type="button"
          onClick={() => {
            setServerError(null);
            setLegacyMode((mode) => !mode);
          }}
          className="mt-5 text-sm text-brand-primary hover:underline"
        >
          {legacyMode ? "Yönetici hesabıyla giriş yap" : "Ortak yönetici şifresiyle giriş yap"}
        </button>
      )}
    </>
  );
}

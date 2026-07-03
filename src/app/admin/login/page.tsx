"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/admin/session";
import { AuthSplitCard } from "@/components/shared/auth-split-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const result = await loginAdmin(password);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <AuthSplitCard
      badge="Yönetim Paneli"
      title="NEXRISE içerik yönetimi"
      description="Etkinlikler, webinarlar, duyurular ve diğer site içerikleri bu panel üzerinden yönetilir."
      features={[
        "Etkinlik ve webinar yönetimi",
        "Duyuru ve blog içerikleri",
        "Başvuru ve iletişim mesajları",
      ]}
    >
      <h1 className="text-xl font-semibold tracking-tight">Admin Girişi</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Yönetim paneline erişmek için yönetici şifresini girin.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">
            Şifre
          </label>
          <Input
            id="admin-password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            autoFocus
            required
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-brand-error">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>
    </AuthSplitCard>
  );
}

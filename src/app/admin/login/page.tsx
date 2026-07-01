"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/admin/session";
import { Container } from "@/components/shared/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section className="flex min-h-[70vh] items-center py-32">
      <Container className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Admin Girişi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Şifre</label>
                <Input name="password" type="password" placeholder="ADMIN_SECRET" required />
              </div>
              {error && <p className="text-sm text-brand-error">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Giriş..." : "Giriş Yap"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}

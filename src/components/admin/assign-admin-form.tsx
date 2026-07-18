"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUserAdminRoleByEmail } from "@/lib/actions/admin/users";
import { adminRoleLabels } from "@/lib/admin/permissions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminRole } from "@/types/database";

const assignableRoles: AdminRole[] = ["super_admin", "admin", "editor", "moderator"];

export function AssignAdminForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const result = await setUserAdminRoleByEmail(email, role);

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSuccess(`${email} kullanıcısına "${adminRoleLabels[role]}" yetkisi verildi.`);
    setEmail("");
    router.refresh();
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">Yeni Admin Ata</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Zaten üye olarak kayıtlı bir hesaba, e-postasını girerek doğrudan
          panel yetkisi verebilirsin. Üye henüz kayıt olmadıysa önce{" "}
          <code>/kayit</code> üzerinden hesap açması gerekir.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label htmlFor="assign-admin-email" className="mb-1.5 block text-sm font-medium">
              E-posta
            </label>
            <Input
              id="assign-admin-email"
              type="email"
              required
              placeholder="uye@eposta.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="assign-admin-role" className="mb-1.5 block text-sm font-medium">
              Yetki
            </label>
            <select
              id="assign-admin-role"
              className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
              value={role}
              onChange={(event) => setRole(event.target.value as AdminRole)}
              disabled={isSubmitting}
            >
              {assignableRoles.map((value) => (
                <option key={value} value={value}>
                  {adminRoleLabels[value]}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Atanıyor..." : "Admin Ata"}
          </Button>
        </form>
        {error && (
          <p role="alert" className="mt-3 text-sm text-brand-error">
            {error}
          </p>
        )}
        {success && <p className="mt-3 text-sm text-brand-success">{success}</p>}
      </CardContent>
    </Card>
  );
}

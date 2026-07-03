"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { saveSponsor } from "@/lib/actions/admin/sponsors";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface SponsorFormValues {
  id?: string;
  name: string;
  tier: string;
  websiteUrl: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
  logoUrl: string | null;
}

const selectClassName =
  "flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm";

export function SponsorForm({ initial }: { initial?: Partial<SponsorFormValues> }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initial?.logoUrl ?? null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    formData.set("isActive", formData.get("isActive") === "on" ? "true" : "false");
    if (initial?.id) formData.set("id", initial.id);

    const result = await saveSponsor(formData);
    if (!result.success) {
      setStatus("idle");
      setErrorMessage(result.error);
      return;
    }
    router.push("/admin/sponsors");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="sponsor-name" className="mb-1.5 block text-sm font-medium">
                Sponsor Adı *
              </label>
              <Input
                id="sponsor-name"
                name="name"
                defaultValue={initial?.name ?? ""}
                required
                minLength={2}
              />
            </div>
            <div>
              <label htmlFor="sponsor-tier" className="mb-1.5 block text-sm font-medium">
                Paket (Tier) *
              </label>
              <select
                id="sponsor-tier"
                name="tier"
                className={selectClassName}
                defaultValue={initial?.tier ?? "partner"}
              >
                <option value="platinum">Platin Sponsor</option>
                <option value="gold">Altın Sponsor</option>
                <option value="silver">Gümüş Sponsor</option>
                <option value="partner">Partner</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="sponsor-website" className="mb-1.5 block text-sm font-medium">
              Web Sitesi
            </label>
            <Input
              id="sponsor-website"
              name="websiteUrl"
              type="url"
              placeholder="https://…"
              defaultValue={initial?.websiteUrl ?? ""}
            />
          </div>

          <div>
            <label htmlFor="sponsor-description" className="mb-1.5 block text-sm font-medium">
              Açıklama
            </label>
            <Textarea
              id="sponsor-description"
              name="description"
              rows={3}
              defaultValue={initial?.description ?? ""}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="sponsor-logo" className="mb-1.5 block text-sm font-medium">
                Logo (JPG/PNG/WebP, en fazla 4 MB)
              </label>
              <input
                id="sponsor-logo"
                name="logo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setLogoPreview(URL.createObjectURL(file));
                }}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-brand-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-primary"
              />
              {logoPreview && (
                <div className="relative mt-3 h-16 w-40 overflow-hidden rounded-lg border border-border bg-white p-1">
                  <Image
                    src={logoPreview}
                    alt="Logo önizleme"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="sponsor-order" className="mb-1.5 block text-sm font-medium">
                Sıralama
              </label>
              <Input
                id="sponsor-order"
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={initial?.sortOrder ?? "0"}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Küçük değer önce gösterilir.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initial?.isActive ?? true}
              className="h-4 w-4 rounded border-border accent-brand-primary"
            />
            Sitede göster
          </label>

          {errorMessage && (
            <p role="alert" className="text-sm text-brand-error">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={status === "saving"}>
              {status === "saving"
                ? "Kaydediliyor..."
                : isEdit
                  ? "Değişiklikleri Kaydet"
                  : "Sponsor Ekle"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/admin/sponsors")}
            >
              Vazgeç
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

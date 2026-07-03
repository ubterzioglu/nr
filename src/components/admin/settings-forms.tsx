"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import {
  saveHeroSettings,
  saveSocialSettings,
  type HeroSettingsInput,
  type SocialSettingsInput,
} from "@/lib/actions/admin/settings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type FormStatus = "idle" | "saving" | "success" | "error";

function StatusMessage({
  status,
  errorMessage,
}: {
  status: FormStatus;
  errorMessage: string | null;
}) {
  if (status === "error") {
    return (
      <p role="alert" className="text-sm text-brand-error">
        {errorMessage}
      </p>
    );
  }
  if (status === "success") {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-brand-success">
        <CheckCircle2 className="h-4 w-4" />
        Kaydedildi; site yaklaşık 1 dakika içinde güncellenir.
      </p>
    );
  }
  return null;
}

export function HeroSettingsForm({ initial }: { initial: HeroSettingsInput }) {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);
    const formData = new FormData(event.currentTarget);
    const result = await saveHeroSettings({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      primaryCtaLabel: String(formData.get("primaryCtaLabel") ?? ""),
      primaryCtaHref: String(formData.get("primaryCtaHref") ?? ""),
      secondaryCtaLabel: String(formData.get("secondaryCtaLabel") ?? ""),
      secondaryCtaHref: String(formData.get("secondaryCtaHref") ?? ""),
    });
    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    setStatus("success");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="hero-title" className="mb-1.5 block text-sm font-medium">
          Ana Başlık
        </label>
        <Input id="hero-title" name="title" defaultValue={initial.title} required />
      </div>
      <div>
        <label htmlFor="hero-description" className="mb-1.5 block text-sm font-medium">
          Açıklama
        </label>
        <Textarea
          id="hero-description"
          name="description"
          rows={3}
          defaultValue={initial.description}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="hero-cta1-label" className="mb-1.5 block text-sm font-medium">
            1. Buton Metni
          </label>
          <Input
            id="hero-cta1-label"
            name="primaryCtaLabel"
            defaultValue={initial.primaryCtaLabel}
            required
          />
        </div>
        <div>
          <label htmlFor="hero-cta1-href" className="mb-1.5 block text-sm font-medium">
            1. Buton Bağlantısı
          </label>
          <Input
            id="hero-cta1-href"
            name="primaryCtaHref"
            defaultValue={initial.primaryCtaHref}
            required
          />
        </div>
        <div>
          <label htmlFor="hero-cta2-label" className="mb-1.5 block text-sm font-medium">
            2. Buton Metni
          </label>
          <Input
            id="hero-cta2-label"
            name="secondaryCtaLabel"
            defaultValue={initial.secondaryCtaLabel}
            required
          />
        </div>
        <div>
          <label htmlFor="hero-cta2-href" className="mb-1.5 block text-sm font-medium">
            2. Buton Bağlantısı
          </label>
          <Input
            id="hero-cta2-href"
            name="secondaryCtaHref"
            defaultValue={initial.secondaryCtaHref}
            required
          />
        </div>
      </div>
      <StatusMessage status={status} errorMessage={errorMessage} />
      <Button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Kaydediliyor..." : "Hero Ayarlarını Kaydet"}
      </Button>
    </form>
  );
}

const socialFields: { name: keyof SocialSettingsInput; label: string }[] = [
  { name: "instagram", label: "Instagram" },
  { name: "youtube", label: "YouTube" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "whatsappChannel", label: "WhatsApp Kanalı" },
  { name: "whatsappCommunity", label: "WhatsApp Topluluğu" },
  { name: "discord", label: "Discord" },
  { name: "telegram", label: "Telegram" },
];

export function SocialSettingsForm({ initial }: { initial: SocialSettingsInput }) {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);
    const formData = new FormData(event.currentTarget);
    const input = Object.fromEntries(
      socialFields.map((field) => [field.name, String(formData.get(field.name) ?? "")])
    ) as SocialSettingsInput;

    const result = await saveSocialSettings(input);
    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    setStatus("success");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {socialFields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`social-${field.name}`}
              className="mb-1.5 block text-sm font-medium"
            >
              {field.label}
            </label>
            <Input
              id={`social-${field.name}`}
              name={field.name}
              type="url"
              placeholder="https://…"
              defaultValue={initial[field.name] ?? ""}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Boş bırakılan alanlarda sitedeki mevcut bağlantı kullanılmaya devam eder.
      </p>
      <StatusMessage status={status} errorMessage={errorMessage} />
      <Button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Kaydediliyor..." : "Bağlantıları Kaydet"}
      </Button>
    </form>
  );
}

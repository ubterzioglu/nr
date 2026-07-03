"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, UserRound } from "lucide-react";
import {
  submitEventRegistration,
  type RegistrationTargetType,
} from "@/lib/actions/registration";
import {
  eventRegistrationSchema,
  type EventRegistrationFormData,
} from "@/lib/validations/forms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KvkkConsentField } from "@/components/forms/kvkk-consent";

interface EventRegistrationFormProps {
  targetType: RegistrationTargetType;
  slug: string;
  /** Kontenjan dolu — form yerine bilgi mesajı gösterilir. */
  capacityFull?: boolean;
  /** Girişli üye: tek tık "Katıl" gösterilir, bilgiler hesaptan alınır. */
  member?: { fullName: string; email: string } | null;
}

export function EventRegistrationForm({
  targetType,
  slug,
  capacityFull = false,
  member = null,
}: EventRegistrationFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [oneClickPending, setOneClickPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventRegistrationFormData>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: { kvkkConsent: false, website: "" },
  });

  if (capacityFull) {
    return (
      <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
        Bu etkinliğin kontenjanı doldu. Gelecek etkinliklerden haberdar olmak
        için topluluğumuza katılabilirsin.
      </p>
    );
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="mt-6 flex items-start gap-2.5 rounded-xl border border-brand-success/20 bg-brand-success/5 p-4 text-sm"
      >
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-success" />
        <span>
          Kaydınız alındı! Katılım bilgileri ve takvim daveti e-posta adresinize
          gönderildi.
        </span>
      </div>
    );
  }

  async function submit(input: Parameters<typeof submitEventRegistration>[0]) {
    setStatus("idle");
    setErrorMessage(null);
    const result = await submitEventRegistration(input);
    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    setStatus("success");
    reset();
  }

  // Girişli üye: tek tık kayıt (content.pdf §5)
  if (member) {
    return (
      <div className="mt-6">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserRound className="h-4 w-4" />
          {member.fullName} ({member.email}) olarak kayıt olacaksın.
        </p>
        <Button
          className="mt-4"
          disabled={oneClickPending}
          onClick={async () => {
            setOneClickPending(true);
            await submit({ targetType, slug });
            setOneClickPending(false);
          }}
        >
          {oneClickPending ? "Kaydediliyor..." : "Katıl"}
        </Button>
        {status === "error" && (
          <p className="mt-3 text-sm text-brand-error">
            {errorMessage ?? "Kayıt başarısız. Tekrar deneyin."}
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((data) =>
        submit({
          targetType,
          slug,
          fullName: data.fullName,
          email: data.email,
          kvkkConsent: data.kvkkConsent,
          website: data.website,
        })
      )}
      className="mt-6 space-y-4"
    >
      <div>
        <label htmlFor="reg-fullname" className="mb-1.5 block text-sm font-medium">
          Ad Soyad
        </label>
        <Input id="reg-fullname" placeholder="Adınız Soyadınız" {...register("fullName")} />
        {errors.fullName && (
          <p className="mt-1 text-sm text-brand-error">{errors.fullName.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium">
          E-posta
        </label>
        <Input
          id="reg-email"
          type="email"
          placeholder="ornek@email.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>
        )}
      </div>

      {/* Honeypot: insanlar görmez, botlar doldurur */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="reg-website">Web siteniz</label>
        <input id="reg-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <KvkkConsentField
        id="reg-kvkk"
        registration={register("kvkkConsent")}
        error={errors.kvkkConsent?.message}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-brand-error">
          {errorMessage ?? "Kayıt başarısız. Tekrar deneyin."}
        </p>
      )}
    </form>
  );
}

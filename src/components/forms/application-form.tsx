"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationFormData } from "@/lib/validations/forms";
import { submitApplication } from "@/lib/actions/forms";
import { applicationTypes } from "@/config/site";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ApplicationForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { type: "volunteer" },
  });

  async function onSubmit(data: ApplicationFormData) {
    setStatus("idle");
    setErrorMessage(null);
    const result = await submitApplication(data);
    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    setStatus("success");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">Ad Soyad</label>
          <Input id="fullName" {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-sm text-brand-error">{errors.fullName.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">E-posta</label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="type" className="mb-1.5 block text-sm font-medium">Başvuru Türü</label>
        <select id="type" className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm" {...register("type")}>
          {applicationTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="city" className="mb-1.5 block text-sm font-medium">Şehir</label>
        <Input id="city" {...register("city")} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Mesaj</label>
        <Textarea id="message" rows={5} {...register("message")} />
        {errors.message && <p className="mt-1 text-sm text-brand-error">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? "Gönderiliyor..." : "Başvuru Gönder"}
      </Button>
      {status === "success" && <p className="text-sm text-brand-success">Başvurunuz alındı! En kısa sürede dönüş yapılacaktır.</p>}
      {status === "error" && (
        <p className="text-sm text-brand-error">
          {errorMessage ??
            "Gönderim başarısız. Lütfen tekrar deneyin veya sosyal medya kanallarımızdan ulaşın."}
        </p>
      )}
    </form>
  );
}

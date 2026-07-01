"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitEventRegistration } from "@/lib/actions/forms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const schema = z.object({
  fullName: z.string().min(2, "Ad soyad en az 2 karakter"),
  email: z.string().email("Geçerli e-posta girin"),
});

type FormData = z.infer<typeof schema>;

export function EventRegistrationForm({ eventSlug }: { eventSlug: string }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setStatus("idle");
    const result = await submitEventRegistration({ eventSlug, ...data });
    if (!result.success) {
      setStatus("error");
      return;
    }
    setStatus("success");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Ad Soyad</label>
        <Input {...register("fullName")} placeholder="Adınız Soyadınız" />
        {errors.fullName && <p className="mt-1 text-sm text-brand-error">{errors.fullName.message}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">E-posta</label>
        <Input type="email" {...register("email")} placeholder="ornek@email.com" />
        {errors.email && <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
      </Button>
      {status === "success" && <p className="text-sm text-brand-success">Kaydınız alındı!</p>}
      {status === "error" && <p className="text-sm text-brand-error">Kayıt başarısız. Tekrar deneyin.</p>}
    </form>
  );
}

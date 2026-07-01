"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sponsorInquirySchema, type SponsorInquiryFormData } from "@/lib/validations/forms";
import { submitSponsorInquiry } from "@/lib/actions/forms";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SponsorInquiryForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SponsorInquiryFormData>({
    resolver: zodResolver(sponsorInquirySchema),
  });

  async function onSubmit(data: SponsorInquiryFormData) {
    setStatus("idle");
    const result = await submitSponsorInquiry(data);
    if (!result.success) {
      setStatus("error");
      return;
    }
    setStatus("success");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Şirket Adı</label>
          <Input {...register("company")} />
          {errors.company && <p className="mt-1 text-sm text-brand-error">{errors.company.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Yetkili</label>
          <Input {...register("contact")} />
          {errors.contact && <p className="mt-1 text-sm text-brand-error">{errors.contact.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">E-posta</label>
        <Input type="email" {...register("email")} />
        {errors.email && <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Mesaj</label>
        <Textarea {...register("message")} />
        {errors.message && <p className="mt-1 text-sm text-brand-error">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>İş Birliği Talebi Gönder</Button>
      {status === "success" && <p className="text-sm text-brand-success">Talebiniz alındı!</p>}
      {status === "error" && <p className="text-sm text-brand-error">Bir hata oluştu.</p>}
    </form>
  );
}

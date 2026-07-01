"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations/forms";
import { submitContact } from "@/lib/actions/forms";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactFormData) {
    setStatus("idle");
    const result = await submitContact(data);
    if (!result.success) {
      setStatus("error");
      return;
    }
    setStatus("success");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">Ad Soyad</label>
        <Input id="fullName" placeholder="Adınız Soyadınız" {...register("fullName")} />
        {errors.fullName && <p className="mt-1 text-sm text-brand-error">{errors.fullName.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">E-posta</label>
        <Input id="email" type="email" placeholder="ornek@email.com" {...register("email")} />
        {errors.email && <p className="mt-1 text-sm text-brand-error">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="city" className="mb-1.5 block text-sm font-medium">Şehir</label>
        <Input id="city" placeholder="Hangi ilden?" {...register("city")} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Mesaj</label>
        <Textarea id="message" placeholder="Mesajınız..." {...register("message")} />
        {errors.message && <p className="mt-1 text-sm text-brand-error">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
      </Button>
      {status === "success" && <p className="text-sm text-brand-success">Mesajınız alındı. Teşekkürler!</p>}
      {status === "error" && <p className="text-sm text-brand-error">Bir hata oluştu. Lütfen tekrar deneyin.</p>}
    </form>
  );
}

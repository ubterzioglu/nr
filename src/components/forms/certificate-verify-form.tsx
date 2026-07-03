"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Kod girilerek sertifika doğrulama sayfasına yönlendirir. */
export function CertificateVerifyForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (normalized) {
      router.push(`/sertifika-dogrula/${encodeURIComponent(normalized)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
      <Input
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="Örn. NX-1A2B3C4D"
        aria-label="Sertifika doğrulama kodu"
      />
      <Button type="submit">Doğrula</Button>
    </form>
  );
}

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ConfirmButtonProps {
  children: React.ReactNode;
  /** Onay penceresinde gösterilen soru. */
  message: string;
  /** Onaylanınca çağrılan server action. */
  action: () => Promise<{ success: boolean; error?: string }>;
  variant?: "secondary" | "outline" | "ghost" | "default";
  size?: "sm" | "default";
  /** Silme gibi yıkıcı işlemlerde kırmızı vurgu uygular. */
  destructive?: boolean;
}

/**
 * Geri alınamaz admin işlemleri (silme vb.) için onaylı buton.
 * Server action sonucunu bekler, sayfayı tazeler, hatayı alert ile bildirir.
 */
export function ConfirmButton({
  children,
  message,
  action,
  variant = "outline",
  size = "sm",
  destructive = true,
}: ConfirmButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(message)) return;
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        window.alert(result.error ?? "İşlem başarısız oldu.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isPending}
      className={destructive ? "text-brand-error hover:bg-brand-error/10" : undefined}
    >
      {isPending ? "..." : children}
    </Button>
  );
}

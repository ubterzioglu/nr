"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth/actions";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.15 3.5 2.7.24.02c2.2-2 3.5-5 3.5-8.6"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.1 0-5.8-2.1-6.7-4.9l-.14.01-3.6 2.8-.05.13C3.4 21.3 7.4 24 12 24"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.5c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-.01-.16-3.7-2.8-.12.06C.5 8.6 0 10.2 0 12s.5 3.4 1.4 4.9l3.9-2.4"
      />
      <path
        fill="#EB4335"
        d="M12 4.6c2.2 0 3.7 1 4.5 1.8l3.3-3.2C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l3.9 3C6.2 6.7 8.9 4.6 12 4.6"
      />
    </svg>
  );
}

export function GoogleAuthButton({ label }: { label: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await signInWithGoogle();
      // Başarıda server action redirect ettiği için buraya yalnız hata düşer.
      if (result && !result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={handleClick}
        disabled={isPending}
      >
        <GoogleIcon />
        {isPending ? "Yönlendiriliyor..." : label}
      </Button>
      {error && <p className="mt-2 text-sm text-brand-error">{error}</p>}
    </div>
  );
}

import Link from "next/link";
import type { UseFormRegisterReturn } from "react-hook-form";

interface KvkkConsentFieldProps {
  id: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

/**
 * Tüm PII toplayan formlarda kullanılan zorunlu KVKK açık rıza alanı.
 * Şema tarafında karşılığı: kvkkConsent z.boolean().refine(v => v === true).
 */
export function KvkkConsentField({ id, registration, error }: KvkkConsentFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-2.5 text-sm">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-border accent-brand-primary"
          {...registration}
        />
        <span className="text-muted-foreground">
          <Link
            href="/kvkk"
            target="_blank"
            className="font-medium text-brand-primary hover:underline"
          >
            KVKK Aydınlatma Metni
          </Link>
          &apos;ni okudum; kişisel verilerimin belirtilen kapsamda işlenmesine
          onay veriyorum.
        </span>
      </label>
      {error && <p className="mt-1 text-sm text-brand-error">{error}</p>}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, XCircle } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Sertifika Doğrulama",
    description: "NEXRISE katılım sertifikası doğrulama sonucu.",
    path: "/sertifika-dogrula",
  }),
  robots: { index: false, follow: false },
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function CertificateResultPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalized = decodeURIComponent(code).trim().toUpperCase();

  const supabase = createServerClient();
  const { data: certificate } = supabase
    ? await supabase
        .from("certificates")
        .select("full_name, event_title, event_date, issued_at, code")
        .eq("code", normalized)
        .maybeSingle()
    : { data: null };

  return (
    <section className="flex min-h-screen items-center bg-muted/30 py-28">
      <Container className="mx-auto w-full max-w-lg">
        <Card>
          <CardContent className="pt-8 text-center">
            {certificate ? (
              <>
                <BadgeCheck className="mx-auto h-12 w-12 text-brand-success" />
                <h1 className="mt-4 text-xl font-semibold">Sertifika Geçerli</h1>
                <div className="mt-6 space-y-2 text-left text-sm">
                  <p className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Ad Soyad</span>
                    <span className="font-medium">{certificate.full_name}</span>
                  </p>
                  <p className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Etkinlik</span>
                    <span className="max-w-56 text-right font-medium">
                      {certificate.event_title}
                    </span>
                  </p>
                  <p className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Etkinlik Tarihi</span>
                    <span className="font-medium">{formatDate(certificate.event_date)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Doğrulama Kodu</span>
                    <span className="font-medium">{certificate.code}</span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="mx-auto h-12 w-12 text-brand-error" />
                <h1 className="mt-4 text-xl font-semibold">Sertifika Bulunamadı</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  &quot;{normalized}&quot; koduna ait geçerli bir NEXRISE
                  sertifikası bulunamadı. Kodu kontrol edip tekrar deneyin.
                </p>
              </>
            )}
            <Button asChild variant="outline" className="mt-8">
              <Link href="/sertifika-dogrula">Başka Kod Doğrula</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}

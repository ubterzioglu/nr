import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Bülten Aboneliği",
    description: "NEXRISE bülten aboneliğinden çıkış.",
    path: "/bulten-iptal",
  }),
  robots: { index: false, follow: false },
};

export default async function NewsletterUnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createServerClient();

  let success = false;
  if (supabase) {
    const { data } = await supabase
      .from("users")
      .update({ newsletter_opt_in: false })
      .eq("newsletter_token", token)
      .select("id")
      .maybeSingle();
    success = Boolean(data);
  }

  return (
    <section className="flex min-h-screen items-center bg-muted/30 py-28">
      <Container className="mx-auto w-full max-w-lg">
        <Card>
          <CardContent className="pt-8 text-center">
            {success ? (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-brand-success" />
                <h1 className="mt-4 text-xl font-semibold">Abonelik iptal edildi</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Bülten aboneliğiniz sonlandırıldı; artık bülten maili
                  almayacaksınız. Fikriniz değişirse profil sayfanızdan yeniden
                  abone olabilirsiniz.
                </p>
              </>
            ) : (
              <>
                <XCircle className="mx-auto h-12 w-12 text-brand-error" />
                <h1 className="mt-4 text-xl font-semibold">Bağlantı geçersiz</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Abonelik iptal bağlantısı geçersiz veya daha önce kullanılmış.
                </p>
              </>
            )}
            <Button asChild variant="outline" className="mt-6">
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}

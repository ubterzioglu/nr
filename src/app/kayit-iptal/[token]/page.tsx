import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { cancelRegistration } from "@/lib/actions/registration";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Kayıt İptali",
    description: "Etkinlik kaydı iptal sayfası.",
    path: "/kayit-iptal",
  }),
  robots: { index: false, follow: false },
};

export default async function CancelRegistrationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await cancelRegistration(token);

  return (
    <section className="flex min-h-screen items-center bg-muted/30 py-28">
      <Container className="mx-auto w-full max-w-lg">
        <Card>
          <CardContent className="pt-8 text-center">
            {result.success ? (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-brand-success" />
                <h1 className="mt-4 text-xl font-semibold">Kaydınız iptal edildi</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  &quot;{result.eventTitle}&quot; etkinliğine olan kaydınız iptal
                  edildi. Fikriniz değişirse etkinlik sayfasından yeniden kayıt
                  olabilirsiniz.
                </p>
              </>
            ) : (
              <>
                <XCircle className="mx-auto h-12 w-12 text-brand-error" />
                <h1 className="mt-4 text-xl font-semibold">İptal başarısız</h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {result.error}
                </p>
              </>
            )}
            <Button asChild variant="outline" className="mt-6">
              <Link href="/etkinlikler">Etkinliklere Dön</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}

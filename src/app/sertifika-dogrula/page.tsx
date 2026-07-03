import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { CertificateVerifyForm } from "@/components/forms/certificate-verify-form";

export const metadata: Metadata = pageMetadata({
  title: "Sertifika Doğrulama",
  description:
    "NEXRISE katılım sertifikalarının geçerliliğini doğrulama kodu veya QR ile kontrol edin.",
  path: "/sertifika-dogrula",
});

export default function CertificateVerifyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sertifika"
        title="Sertifika Doğrulama"
        description="Sertifikanın üzerindeki doğrulama kodunu girerek geçerliliğini kontrol edebilirsiniz."
      />
      <section className="py-20">
        <Container>
          <CertificateVerifyForm />
        </Container>
      </section>
    </>
  );
}

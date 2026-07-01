import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "NEXRISE gizlilik politikası.",
};

export default function GizlilikPage() {
  return (
    <>
      <PageHeader eyebrow="Yasal" title="Gizlilik Politikası" />
      <section className="py-20">
        <Container className="prose prose-slate dark:prose-invert max-w-3xl">
          <p>NEXRISE olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu politika, web sitemiz ve platformumuz aracılığıyla toplanan verilerin nasıl işlendiğini açıklar.</p>
          <h2>Toplanan Veriler</h2>
          <p>İletişim formları, başvuru formları ve etkinlik kayıtları aracılığıyla ad, e-posta, şehir ve mesaj bilgileri toplanabilir.</p>
          <h2>Verilerin Kullanımı</h2>
          <p>Toplanan veriler yalnızca NEXRISE ekosistemi kapsamında iletişim, etkinlik yönetimi ve topluluk faaliyetleri için kullanılır.</p>
          <h2>İletişim</h2>
          <p>
            Sorularınız için{" "}
            <Link href="/iletisim" className="text-brand-primary hover:underline">
              sosyal medya hesaplarımız
            </Link>{" "}
            üzerinden bize ulaşabilirsiniz.
          </p>
        </Container>
      </section>
    </>
  );
}

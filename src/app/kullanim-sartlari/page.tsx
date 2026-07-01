import type { Metadata } from "next";
import Link from "next/link";
import { communityRulesContent } from "@/config/content";
import { brand } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = pageMetadata({
  title: "Kullanım Şartları",
  description: "NEXRISE kullanım şartları ve topluluk kuralları — el kitabından.",
  path: "/kullanim-sartlari",
});

export default function KullanimSartlariPage() {
  return (
    <>
      <PageHeader eyebrow="Yasal" title="Kullanım Şartları" description={communityRulesContent.intro} />
      <section className="py-20">
        <Container className="prose prose-slate dark:prose-invert max-w-3xl">
          <p>
            {brand.name} web platformunu ve topluluk kanallarını kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.
          </p>

          <h2>{communityRulesContent.title}</h2>
          <ul>
            {communityRulesContent.rules.map((rule) => (
              <li key={rule.slice(0, 24)}>{rule}</li>
            ))}
          </ul>

          <h2>Fikri Mülkiyet</h2>
          <p>
            NEXRISE logosu ve kurumsal materyaller resmî marka varlıklarıdır; izinsiz kullanılamaz ve yeniden tasarlanamaz.
            Renk paleti: Primary #1D6FFF, Secondary #2AA7FF, Dark #050B1A, Background #F8FAFC, Accent #5CC8FF.
          </p>

          <h2>Platform Kullanımı</h2>
          <p>
            Etkinlik, webinar ve blog içerikleri bilgilendirme amaçlıdır. Üçüncü taraf bağlantılardan NEXRISE sorumlu değildir.
            Başvuru formlarında verdiğiniz bilgiler yalnızca ekosistem iletişimi için kullanılır.
          </p>

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

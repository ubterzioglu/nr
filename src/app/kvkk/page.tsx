import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "KVKK Aydınlatma Metni",
  description:
    "NEXRISE kişisel verilerin korunması ve işlenmesine ilişkin aydınlatma metni.",
  path: "/kvkk",
});

export default function KvkkPage() {
  return (
    <>
      <PageHeader eyebrow="Yasal" title="KVKK Aydınlatma Metni" />
      <section className="py-20">
        <Container className="prose prose-slate dark:prose-invert max-w-3xl">
          <p>
            Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu
            (&quot;KVKK&quot;) uyarınca, veri sorumlusu sıfatıyla NEXRISE
            tarafından kişisel verilerinizin işlenmesine ilişkin olarak sizi
            bilgilendirmek amacıyla hazırlanmıştır.
          </p>

          <h2>İşlenen Kişisel Veriler</h2>
          <p>
            Web sitemizdeki üyelik, iletişim, başvuru ve etkinlik/webinar kayıt
            formları aracılığıyla aşağıdaki kişisel verileriniz işlenebilir:
          </p>
          <ul>
            <li>Kimlik bilgileri: ad, soyad</li>
            <li>İletişim bilgileri: e-posta adresi, şehir</li>
            <li>
              Üyelik profili bilgileri: kullanıcı adı, eğitim/meslek bilgisi,
              ilgi alanları, sosyal medya bağlantıları (isteğe bağlı)
            </li>
            <li>Etkinlik katılım ve sertifika kayıtları</li>
            <li>Form içeriğinde ilettiğiniz mesajlar</li>
          </ul>

          <h2>İşleme Amaçları</h2>
          <p>Kişisel verileriniz yalnızca aşağıdaki amaçlarla işlenir:</p>
          <ul>
            <li>Üyelik hesabınızın oluşturulması ve yönetilmesi</li>
            <li>Etkinlik ve webinar kayıtlarının alınması ve yürütülmesi</li>
            <li>
              Kayıt olduğunuz etkinliklere ilişkin bilgilendirme, hatırlatma ve
              katılım sertifikası e-postalarının gönderilmesi
            </li>
            <li>Başvuruların (gönüllü, başkanlık, mentor vb.) değerlendirilmesi</li>
            <li>İletişim taleplerinizin yanıtlanması</li>
            <li>Açık rızanız varsa bülten ve duyuru gönderimi</li>
          </ul>

          <h2>Aktarım ve Saklama</h2>
          <p>
            Verileriniz, hizmetin sağlanması için kullanılan barındırma ve
            e-posta altyapısı sağlayıcıları dışında üçüncü kişilerle
            paylaşılmaz; ticari amaçla hiçbir şekilde satılmaz veya
            kiralanmaz. Verileriniz, işleme amacının gerektirdiği süre boyunca
            ve ilgili mevzuattaki zamanaşımı süreleri saklı kalmak kaydıyla
            saklanır.
          </p>

          <h2>KVKK Kapsamındaki Haklarınız</h2>
          <p>
            KVKK&apos;nın 11. maddesi uyarınca; kişisel verilerinizin işlenip
            işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,
            düzeltilmesini veya silinmesini isteme, işlemeye itiraz etme ve
            zarara uğramanız hâlinde giderilmesini talep etme haklarına
            sahipsiniz.
          </p>

          <h2>Başvuru</h2>
          <p>
            Haklarınıza ilişkin taleplerinizi{" "}
            <Link href="/iletisim" className="text-brand-primary hover:underline">
              iletişim sayfamız
            </Link>{" "}
            üzerinden bize iletebilirsiniz. Ayrıca{" "}
            <Link
              href="/gizlilik-politikasi"
              className="text-brand-primary hover:underline"
            >
              Gizlilik Politikamızı
            </Link>{" "}
            inceleyebilirsiniz.
          </p>
        </Container>
      </section>
    </>
  );
}

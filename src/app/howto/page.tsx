import type { Metadata } from "next";
import Link from "next/link";
import {
  UserRound,
  ShieldCheck,
  LogIn,
  CalendarCheck,
  FileText,
  BadgeCheck,
  MessageSquareText,
  Settings2,
  LayoutDashboard,
  Users,
  Mail,
  Newspaper,
  Megaphone,
  ClipboardList,
  History,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import { MotionDiv } from "@/components/shared/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = pageMetadata({
  title: "Nasıl Kullanılır?",
  description:
    "NEXRISE web sitesi kullanıcılar ve yöneticiler için adım adım nasıl kullanılır? Üyelik, etkinlik kaydı, başvurular, sertifika doğrulama ve yönetim paneli rehberi.",
  path: "/howto",
});

const userSteps = [
  {
    icon: UserRound,
    title: "1. Siteye göz atmak için üye olmana gerek yok",
    body: "Ana sayfa, Hakkımızda, Etkinlikler, Webinarlar, Blog, Topluluklar, Başkanlıklar ve Sponsorlar gibi sayfaları herkes üye olmadan gezebilir. Yani önce siteyi kurcalayıp neye benzediğini görebilirsin, hesap açman şart değil.",
  },
  {
    icon: LogIn,
    title: "2. Hesap oluşturmak (üye olmak) istersen",
    body: (
      <>
        Sağ üstteki <strong>Giriş</strong> alanından{" "}
        <Link href="/kayit" className="text-brand-primary hover:underline">
          /kayit
        </Link>{" "}
        sayfasına gidip formu doldurman yeterli — üyelik tamamen ücretsiz.
        Üye olunca etkinliklere tek tıkla kaydolabilir, katıldığın etkinliklerin
        dijital sertifikalarını görebilir ve profilini yönetebilirsin. Zaten
        hesabın varsa{" "}
        <Link href="/giris" className="text-brand-primary hover:underline">
          /giris
        </Link>{" "}
        sayfasından e-posta ve şifrenle giriş yaparsın. Şifreni unutursan{" "}
        <Link href="/sifre-sifirla" className="text-brand-primary hover:underline">
          /sifre-sifirla
        </Link>{" "}
        sayfası şifre yenileme e-postası gönderir.
      </>
    ),
  },
  {
    icon: CalendarCheck,
    title: "3. Etkinlik veya webinara nasıl kaydolunur",
    body: (
      <>
        <Link href="/etkinlikler" className="text-brand-primary hover:underline">
          Etkinlikler
        </Link>{" "}
        ya da{" "}
        <Link href="/webinarlar" className="text-brand-primary hover:underline">
          Webinarlar
        </Link>{" "}
        sayfasında ilgini çeken bir etkinliğin detay sayfasını aç, oradaki
        kayıt formunu doldur. Kontenjan doluysa veya kayıt kapalıysa bunu
        sayfada görürsün. Üye değilsen bile e-postanla misafir olarak kayıt
        olabilirsin; üye olarak kayıt olursan bu kayıt otomatik olarak profilinde
        de görünür.
      </>
    ),
  },
  {
    icon: FileText,
    title: "4. Başvuru yapmak (yönetim, gönüllü, başkanlık, mentor, konuşmacı, sponsor, partner)",
    body: (
      <>
        <Link href="/basvurular" className="text-brand-primary hover:underline">
          Başvurular
        </Link>{" "}
        sayfasında 7 farklı başvuru türü var: Yönetim, Gönüllü, Başkanlık, Mentor,
        Konuşmacı, Sponsor ve Partner. Kartlardan sana uygun olanı okuyup
        aşağıdaki tek formdan başvuru türünü seçerek gönderiyorsun. Başvurun
        e-posta ile ekibe iletilir; ayrıca sistemde kaydı tutulur.
      </>
    ),
  },
  {
    icon: BadgeCheck,
    title: "5. Sertifikanı doğrulamak",
    body: (
      <>
        Bir etkinliğe katılıp sertifika aldıysan, sertifikanın üzerindeki
        doğrulama kodunu{" "}
        <Link href="/sertifika-dogrula" className="text-brand-primary hover:underline">
          /sertifika-dogrula
        </Link>{" "}
        sayfasına girerek gerçek ve geçerli olduğunu herkese kanıtlayabilirsin —
        örneğin bir işverene gösterirken. Kod girildiğinde sistem sertifikayı
        veritabanında arar ve bulursa etkinlik bilgisiyle birlikte onaylar.
      </>
    ),
  },
  {
    icon: UserRound,
    title: "6. Profilim sayfası ne işe yarar",
    body: (
      <>
        Giriş yaptıktan sonra{" "}
        <Link href="/profil" className="text-brand-primary hover:underline">
          /profil
        </Link>{" "}
        sayfasında kayıt olduğun tüm etkinlik ve webinarları, aldığın
        sertifikaları ve katılım durumunu tek yerde görürsün. Buradan istersen
        bir kaydını iptal edebilir, istersen bilgilerini düzenleyebilirsin
        (profilim → düzenle).
      </>
    ),
  },
  {
    icon: MessageSquareText,
    title: "7. Geri bildirim ve revizyon isteği göndermek",
    body: (
      <>
        Üye olarak giriş yaptıysan{" "}
        <Link href="/geri-bildirim" className="text-brand-primary hover:underline">
          Geri Bildirim
        </Link>{" "}
        sayfasından siteyle ilgili görüş ve önerilerini, {" "}
        <Link href="/revizyon-istekleri" className="text-brand-primary hover:underline">
          Revizyon İstekleri
        </Link>{" "}
        sayfasından ise geliştirilmesini istediğin bir özelliği veya
        düzeltilmesini istediğin bir sorunu iletebilirsin. Bu iki sayfa
        üye girişi gerektirir, çünkü gönderdiklerin herkese açık bir liste
        halinde görünür ve isim/e-posta bilgin kayıt altına alınır.
      </>
    ),
  },
  {
    icon: Mail,
    title: "8. Sorun mu var, soru mu soracaksın?",
    body: (
      <>
        <Link href="/iletisim" className="text-brand-primary hover:underline">
          İletişim
        </Link>{" "}
        sayfasındaki formu kullan; NEXRISE&apos;in tek bir resmi e-posta
        adresi olmadığı için mesajın ekibe iletişim formu üzerinden ulaşır.
        Sosyal medya kanallarımızdan (Instagram, YouTube, LinkedIn) da bize
        ulaşabilirsin.
      </>
    ),
  },
];

const adminModules = [
  {
    icon: LayoutDashboard,
    label: "Panel Ana Sayfası",
    desc: "Genel özet: bekleyen başvuru sayısı, yaklaşan etkinlikler ve son aktiviteler tek bakışta burada.",
  },
  {
    icon: CalendarCheck,
    label: "Etkinlikler",
    desc: "Etkinlik ekleme/düzenleme, her etkinliğin kayıtlı katılımcı listesini görme (etkinlik → kayıtlar).",
  },
  {
    icon: CalendarCheck,
    label: "Webinarlar",
    desc: "Etkinliklerle aynı mantıkta: webinar ekle/düzenle, kayıtlı katılımcıları webinar → kayıtlar altında gör.",
  },
  {
    icon: FileText,
    label: "Başvurular",
    desc: "Kullanıcıların gönderdiği yönetim/gönüllü/başkanlık/mentor/konuşmacı/sponsor/partner başvurularını incele, durumunu güncelle.",
  },
  {
    icon: Newspaper,
    label: "Blog",
    desc: "Blog yazısı ekle, düzenle; yayın öncesi taslak olarak da tutabilirsin.",
  },
  {
    icon: Users,
    label: "Yönetim Kurulu (Board)",
    desc: "Sitede görünen yönetim kadrosu üyelerini ekle/düzenle (isim, rol, fotoğraf, biyografi).",
  },
  {
    icon: Mail,
    label: "İletişim Mesajları (Contacts)",
    desc: "İletişim formundan gelen mesajları görüntüle, gerekirse durumunu işaretle.",
  },
  {
    icon: Users,
    label: "Başkanlıklar (Departments)",
    desc: "Sitedeki başkanlık/departman kartlarını ve içeriklerini yönet.",
  },
  {
    icon: MessageSquareText,
    label: "Geri Bildirimler",
    desc: "Üyelerin gönderdiği geri bildirimleri gör, yorum yaz, durumunu güncelle.",
  },
  {
    icon: History,
    label: "Revizyon İstekleri",
    desc: "Üyelerin talep ettiği geliştirme/düzeltme isteklerini takip et, durumunu güncelle.",
  },
  {
    icon: Megaphone,
    label: "Duyurular (Announcements)",
    desc: "Site genelinde gösterilecek duyuru bantları/mesajları oluştur, düzenle.",
  },
  {
    icon: Users,
    label: "Sponsorlar",
    desc: "Sponsor logolarını ve seviyelerini (platinum/gold/silver/partner) ekle/düzenle.",
  },
  {
    icon: ClipboardList,
    label: "Görevler (Tasks)",
    desc: "Ekip içi yapılacaklar listesi — yönetim panelini kullanan ekip üyeleri arasında iş takibi.",
  },
  {
    icon: Newspaper,
    label: "Güncellemeler (Updates)",
    desc: "Site/ürün güncelleme notlarını yayınla.",
  },
  {
    icon: Users,
    label: "Kullanıcılar (Users)",
    desc: "Kayıtlı üyeleri listele, gerekirse hesap durumunu (aktif/pasif) ve yönetici rolünü yönet.",
  },
  {
    icon: Mail,
    label: "Mail",
    desc: "E-posta bildirim ayarları ve gönderim geçmişiyle ilgili araçlar.",
  },
  {
    icon: History,
    label: "Denetim Kaydı (Audit)",
    desc: "Panelde kim ne zaman ne değiştirdi — işlem geçmişini gösterir, hesap verebilirlik için önemlidir.",
  },
  {
    icon: Settings2,
    label: "Ayarlar (Settings)",
    desc: "Panelle ilgili genel yapılandırma seçenekleri.",
  },
];

export default function HowToPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rehber"
        title="Nasıl Kullanılır?"
        description="NEXRISE web sitesini yeni kullanıyorsan doğru yerdesin. Bu sayfa, hem sıradan bir ziyaretçi/üye olarak hem de yönetim panelini kullanan bir admin olarak siteyi adım adım, sade bir dille anlatır."
      />

      {/* Kullanıcılar İçin */}
      <section className="py-20">
        <Container>
          <SectionHeader
            eyebrow="Kullanıcılar İçin"
            title="Siteyi bir ziyaretçi veya üye olarak nasıl kullanırsın?"
            description="Aşağıdaki adımları sırayla okuman gerekmiyor — ihtiyacın olan bölümü aç, oku, uygula."
          />
          <MotionDiv className="grid gap-4 md:grid-cols-2">
            {userSteps.map((step) => (
              <Card key={step.title} className="h-full">
                <CardHeader className="flex-row items-start gap-3 space-y-0">
                  <div className="mt-0.5 rounded-lg bg-brand-primary/10 p-2 text-brand-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base leading-snug">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </CardContent>
              </Card>
            ))}
          </MotionDiv>
        </Container>
      </section>

      {/* Neden / Nasıl - SSS tarzı ek açıklamalar */}
      <section className="bg-muted/30 py-20">
        <Container>
          <SectionHeader
            eyebrow="Merak Edilenler"
            title="Kullanıcılar için sık sorulan &quot;neden&quot; ve &quot;nasıl&quot; soruları"
          />
          <MotionDiv className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="why-1">
                <AccordionTrigger>Neden üye olmalıyım, üye olmadan ne kaybederim?</AccordionTrigger>
                <AccordionContent>
                  Üye olmadan da etkinliklere misafir olarak (sadece e-posta ile)
                  kayıt olabilirsin. Ama üyelik seni bir profil sayfasına
                  bağlar: geçmiş kayıtlarını, sertifikalarını ve katılım
                  durumunu tek yerden takip edebilirsin. Ayrıca geri bildirim
                  ve revizyon isteği gönderebilmek için üyelik şart.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="why-2">
                <AccordionTrigger>Etkinlik kaydımı nasıl iptal ederim?</AccordionTrigger>
                <AccordionContent>
                  Giriş yaptıktan sonra Profilim sayfasında ilgili kaydın
                  yanındaki iptal butonuna basman yeterli. Kayıt anında
                  kaldırılır.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="why-3">
                <AccordionTrigger>Sertifikam neden doğrulanamadı?</AccordionTrigger>
                <AccordionContent>
                  En sık neden yanlış veya eksik yazılmış bir doğrulama kodu.
                  Kodu sertifikanın üzerinden birebir kopyalayıp yapıştırmayı
                  dene. Sorun devam ederse{" "}
                  <Link href="/iletisim" className="text-brand-primary hover:underline">
                    İletişim
                  </Link>{" "}
                  sayfasından bize yaz.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="why-4">
                <AccordionTrigger>Başvurumun durumunu nereden takip ederim?</AccordionTrigger>
                <AccordionContent>
                  Başvurular şu an panelde ekip tarafından değerlendirilip
                  sonuç e-posta ile iletiliyor; sitede kendi başına bir
                  &quot;başvuru durumu&quot; takip ekranı yok. Uzun süre
                  yanıt alamazsan İletişim sayfasından ekibe hatırlatma
                  gönderebilirsin.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="why-5">
                <AccordionTrigger>Bültenden/e-postalardan nasıl çıkarım?</AccordionTrigger>
                <AccordionContent>
                  Sana gelen bilgilendirme e-postalarındaki bağlantı seni{" "}
                  <Link href="/bulten-iptal" className="text-brand-primary hover:underline">
                    /bulten-iptal
                  </Link>{" "}
                  sayfasına götürür; oradan tek tıkla abonelikten
                  çıkabilirsin.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </MotionDiv>
        </Container>
      </section>

      {/* Adminler İçin */}
      <section className="py-20">
        <Container>
          <SectionHeader
            eyebrow="Yöneticiler İçin"
            title="Yönetim panelini bir admin olarak nasıl kullanırsın?"
            description="Yönetim paneli, sitedeki içerikleri (etkinlik, webinar, blog, başvuru vb.) yönetmek için kullanılır. Panelde yaptığın değişiklikler siteye otomatik olarak yansır."
          />

          <div className="mb-14 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <div className="rounded-lg bg-brand-primary/10 p-2 text-brand-primary">
                  <LogIn className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">1. Panele nasıl giriş yaparsın</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <Link href="/admin/login" className="text-brand-primary hover:underline">
                    /admin/login
                  </Link>{" "}
                  adresine gidip sana tanımlanmış e-posta ve şifreyle giriş
                  yaparsın. Bu, normal üye girişinden farklı bir sistemdir —
                  hesabının veritabanında bir &quot;yönetici rolü&quot;
                  (admin_role) işaretli ve aktif olması gerekir.
                </p>
                <p>
                  Yönetici rolün yoksa veya hesabın pasifse giriş
                  reddedilir. Rol ataması, sistem üzerinde zaten yönetici
                  yetkisi olan biri tarafından yapılır.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <div className="rounded-lg bg-brand-primary/10 p-2 text-brand-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">2. Panelde nelere dikkat etmelisin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Panelden yaptığın her ekleme/düzenleme/silme işlemi
                  sitede canlı olarak (birkaç dakika içinde) görünür — yani
                  &quot;taslak kaydet, sonra yayınla&quot; gibi ekstra bir
                  onay adımı olmayan alanlarda dikkatli ol.
                </p>
                <p>
                  Yaptığın önemli işlemler <strong>Denetim Kaydı (Audit)</strong>{" "}
                  bölümünde tutulur, yani kim neyi ne zaman değiştirdi
                  görülebilir. Emin olmadığın bir değişikliği yapmadan önce
                  ekip arkadaşına danış.
                </p>
              </CardContent>
            </Card>
          </div>

          <SectionHeader
            align="left"
            title="Panel bölümleri (soldaki menüde göreceklerin)"
            className="mb-8"
          />
          <MotionDiv className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {adminModules.map((mod) => (
              <div
                key={mod.label}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="mt-0.5 rounded-lg bg-brand-primary/10 p-2 text-brand-primary">
                  <mod.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{mod.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {mod.desc}
                  </p>
                </div>
              </div>
            ))}
          </MotionDiv>
        </Container>
      </section>

      {/* Adminler için SSS */}
      <section className="bg-muted/30 py-20">
        <Container>
          <SectionHeader
            eyebrow="Merak Edilenler"
            title="Yöneticiler için sık sorulan sorular"
          />
          <MotionDiv className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="admin-1">
                <AccordionTrigger>Neden yönetim paneli /mvpubt&apos;yi yönetiyor, /mvp&apos;yi değil?</AccordionTrigger>
                <AccordionContent>
                  <code>/mvp</code> sayfası tasarım dondurma (code freeze)
                  altında olduğu için hiç değiştirilmiyor. Yeni geliştirmeler
                  ve panelin yönettiği içerikler <code>/mvpubt</code>{" "}
                  üzerinde yayınlanıyor. Panelden yaptığın değişiklikler
                  ortak veritabanı üzerinden hem <code>/mvp</code> hem{" "}
                  <code>/mvpubt</code> sayfalarına yansır — ama sayfa
                  tasarımının kendisi <code>/mvp</code>&apos;de sabit
                  kalır.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="admin-2">
                <AccordionTrigger>Şifremle mi yoksa ortak admin şifresiyle mi giriş yapmalıyım?</AccordionTrigger>
                <AccordionContent>
                  Elinden geldiğince kendi e-posta/şifre hesabınla giriş
                  yap. Eski &quot;ortak şifre&quot; girişi yalnızca geçiş
                  dönemi için açık tutuluyor ve ileride tamamen
                  kaldırılacak; yeni hesap sistemi kim ne yaptı bilgisini
                  daha net tutar.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="admin-3">
                <AccordionTrigger>Bir kullanıcıya nasıl yönetici yetkisi veririm?</AccordionTrigger>
                <AccordionContent>
                  Kullanıcılar (Users) bölümünden ilgili hesabı bulup
                  yönetici rolünü (admin_role) atayabilirsin. Bunu sadece
                  gerçekten panele erişmesi gereken ekip üyelerine yap;
                  yetkiyi geniş tutmak güvenlik riskidir.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="admin-4">
                <AccordionTrigger>Sildiğim bir kaydı geri alabilir miyim?</AccordionTrigger>
                <AccordionContent>
                  Panelde geri al (undo) özelliği yok. Silmeden önce emin
                  ol; kritik verilerde önce ekip arkadaşınla teyitleş.
                  Denetim Kaydı, neyin ne zaman silindiğini görmene yardımcı
                  olur ama silinen veriyi otomatik geri getirmez.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </MotionDiv>
        </Container>
      </section>

      <section className="py-20">
        <Container className="text-center">
          <Badge variant="secondary" className="mb-4">Hâlâ takıldığın bir şey mi var?</Badge>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Bu rehber sorunu çözmediyse bize ulaş
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            <Link href="/iletisim" className="text-brand-primary hover:underline">
              İletişim
            </Link>{" "}
            sayfasından yazabilir, ya da sosyal medya kanallarımızdan bize
            ulaşabilirsin.
          </p>
        </Container>
      </section>
    </>
  );
}

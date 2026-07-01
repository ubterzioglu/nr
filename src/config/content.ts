/** Kurumsal metinler — El kitabı + NEXRISE marka içeriği */

import { handbookOrganization, handbookSocialRules, handbookWorkingPrinciples } from "@/config/handbook";

export const aboutContent = {
  whatIs: {
    title: "NEXRISE Nedir?",
    paragraphs: [
      "NEXRISE; teknoloji, girişimcilik, yapay zekâ, inovasyon ve kariyer alanlarında bireyleri, girişimleri ve profesyonelleri aynı ekosistemde buluşturan bağımsız bir topluluk platformudur.",
      "Öğrenciler, girişimciler, yazılımcılar, startup kurucuları, profesyoneller, mentorlar ve şirketleri tek çatı altında buluşturur. Türkiye'nin 81 ilinden gençleri aynı platformda bir araya getirir.",
      "Amacımız; birlikte öğrenmek, üretmek, iş birliği yapmak ve Rise of the Next Generation vizyonuyla geleceği inşa etmektir.",
    ],
  },
  whatWeDo: {
    title: "Ne Yapıyoruz?",
    items: [
      "Webinar, eğitim ve zirve düzenleriz",
      "Startup ve girişim ekipleri kurarız",
      "Mentorluk ve profesyonel network fırsatları sağlarız",
      "Teknoloji topluluklarını bir araya getiririz",
      "Kariyer, burs ve staj duyurularını paylaşırız",
      "Kurumlarla iş birlikleri geliştiririz",
      "Dijital kanallarda (Instagram, YouTube, LinkedIn, WhatsApp) topluluğu büyütürüz",
    ],
  },
  whyFounded: {
    title: "Neden Kuruldu?",
    paragraphs: [
      "Genç yeteneklerin teknoloji ve girişimcilik dünyasına erişimi sınırlı; bilgi, mentorluk ve network kaynakları dağınıktı.",
      "NEXRISE, bu boşluğu doldurmak için kuruldu: Herkesin öğrenebileceği, üretebileceği ve birlikte yükselilebileceği merkezi, disiplinli ve güvenilir bir ekosistem.",
      "Birlikte Üretiyor, Birlikte Yükseliyoruz — bu motto, kuruluş felsefemizin özünü taşır.",
    ],
  },
  problem: {
    title: "Hangi Problemi Çözüyoruz?",
    paragraphs: [
      "Teknoloji ve girişimcilik alanında bilgiye erişim, doğru network ve gerçek fırsatlara ulaşım birçok genç için zordur.",
      "NEXRISE; dağınık kaynakları tek çatı altında toplar, etkinlik ve eğitimlerle pratik bilgi sunar, topluluk kültürüyle sürdürülebilir bir gelişim ortamı oluşturur.",
      "Etkinlik, eğitim, burs ve kariyer fırsatlarının topluluğa hızlı ulaştırılması temel önceliğimizdir.",
    ],
  },
  audience: {
    title: "Kimlere Hitap Ediyoruz?",
    items: [
      "Lise ve üniversite öğrencileri",
      "Genç profesyoneller ve kariyer değiştirenler",
      "Erken aşama girişimciler ve startup ekipleri",
      "Yazılımcılar, teknoloji meraklıları ve inovasyon tutkunları",
      "Mentorlar, konuşmacılar ve sektör profesyonelleri",
      "Kurumsal iş birliği yapmak isteyen şirketler",
    ],
  },
};

export const storyContent = {
  title: "Hikâyemiz",
  paragraphs: [
    "NEXRISE, teknoloji ve girişimcilik tutkusuyla yola çıkan genç liderlerin ortak vizyonuyla doğdu. Amaç yalnızca etkinlik düzenlemek değil; kalıcı, üretken ve sürdürülebilir bir ekosistem inşa etmekti.",
    "Farklı şehirlerden ve disiplinlerden bireyleri aynı çatı altında buluşturarak üretmeyi, öğrenmeyi ve birlikte gelişmeyi destekleyen bir platform oluşturduk.",
    "Bugün NEXRISE; Yönetim Kurulu, Başkan Yardımcıları ve 6 başkanlık sistemiyle Türkiye genelinde büyüyen bağımsız bir gençlik hareketidir.",
  ],
  goal: "Hedefimiz; Türkiye'nin ve dünyanın en güçlü genç teknoloji ve girişimcilik ekosistemlerinden biri olmak.",
};

export const subSlogans = [
  "Together We Build The Future",
  "Learn • Connect • Build",
  "Technology Meets Entrepreneurship",
  "Building Tomorrow Together",
];

export const whatNexriseDoes = [
  "Webinar düzenler",
  "Eğitim düzenler",
  "Zirve düzenler",
  "Startup ekibi kurar",
  "Girişim ekipleri oluşturur",
  "Mentorluk sağlar",
  "Network oluşturur",
  "İş birlikleri kurar",
  "Teknoloji topluluklarını bir araya getirir",
  "Kariyer fırsatları paylaşır",
  "Burs ve staj duyuruları paylaşır",
];

export const managementModel = {
  title: "Yönetim Modeli",
  description: handbookOrganization.intro,
  sections: [
    {
      title: "Yönetim Kurulu Başkanı",
      body: handbookOrganization.chairman,
    },
    {
      title: handbookOrganization.vicePresidents[0].title,
      body: handbookOrganization.vicePresidents[0].scope,
    },
    {
      title: handbookOrganization.vicePresidents[1].title,
      body: handbookOrganization.vicePresidents[1].scope,
    },
  ],
  principles: handbookWorkingPrinciples,
};

export const communityRulesContent = {
  title: "Topluluk Kuralları",
  intro: "NEXRISE ekosisteminde tüm üyeler aşağıdaki kurallara uymayı kabul eder. Bu kurallar el kitabımızdan alınmıştır.",
  rules: handbookSocialRules,
};

export const adminCapabilities = [
  { icon: "📝", label: "Blog paylaşma ve düzenleme" },
  { icon: "🎤", label: "Webinar oluşturma ve düzenleme" },
  { icon: "📅", label: "Etkinlik oluşturma ve yönetme" },
  { icon: "📢", label: "Duyuru paylaşma" },
  { icon: "🏢", label: "Sponsor ve partner ekleme" },
  { icon: "👥", label: "Yönetim kadrosu güncelleme" },
  { icon: "🏛️", label: "Başkanlık bilgilerini düzenleme" },
  { icon: "📋", label: "Başvuruları okuma, onaylama ve reddetme" },
  { icon: "🔐", label: "Kullanıcı yönetimi ve rol atama" },
  { icon: "📬", label: "İletişim mesajlarını görüntüleme" },
  { icon: "📊", label: "Dashboard istatistiklerini izleme" },
];

export const blogArticleBodies: Record<string, string[]> = {
  "nexrise-topluluk-kurallari": [
    "NEXRISE platformu siyaset üstüdür. Tüm iletişim yapıcı, saygılı ve profesyonel olmalıdır.",
    "Argo, hakaret, ayrımcılık ve izinsiz reklam kesinlikle yasaktır. Bu kurallar kurumsal el kitabımızın temelidir.",
    "Disiplin, şeffaflık, takım ruhu ve sürekli gelişim — NEXRISE değerlerinin topluluk davranışına yansımasıdır.",
  ],
};

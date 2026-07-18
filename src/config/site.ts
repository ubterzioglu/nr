import type {
  Community,
  Event,
  Webinar,
  BlogPost,
  TeamMember,
  Sponsor,
  FAQItem,
  SocialLink,
  NavItem,
  ApplicationType,
  DashboardApplication,
  DashboardMessage,
} from "@/types";
import { subSlogans } from "@/config/content";
import { handbookPresidencies } from "@/config/handbook";

export const brand = {
  name: "NEXRISE",
  slogan: "Rise of the Next Generation",
  tagline: "Birlikte Üretiyor, Birlikte Yükseliyoruz.",
  subSlogans,
  description:
    "NEXRISE; teknoloji, girişimcilik, yapay zekâ, inovasyon ve kariyer alanlarında bireyleri, girişimleri ve profesyonelleri aynı ekosistemde buluşturan bağımsız bir topluluk platformudur.",
  seoDescription:
    "NEXRISE — Türkiye'nin 81 ilinden gençleri buluşturan teknoloji ve girişimcilik ekosistemi. Webinar, eğitim, zirve, mentorluk ve kariyer fırsatları. Rise of the Next Generation.",
  contactNote:
    "Resmî e-posta adresimiz bulunmamaktadır. Bize Instagram, YouTube, LinkedIn ve WhatsApp kanallarımız üzerinden ulaşabilirsiniz.",
  location: "İstanbul, Türkiye",
  socialHandles: {
    instagram: "@nexriseoff",
    youtube: "@nexriseoffical",
    linkedin: "NEXRISE",
  },
  colors: {
    primary: "#1D6FFF",
    secondary: "#2AA7FF",
    dark: "#050B1A",
    white: "#FFFFFF",
    background: "#F8FAFC",
    accent: "#5CC8FF",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
  },
} as const;

/** Marka değerleri (kurumsal kimlik) */
export const brandValues = [
  "Teknoloji",
  "Girişimcilik",
  "İnovasyon",
  "Güven",
  "Profesyonellik",
  "Sürekli Gelişim",
  "Topluluk",
  "Üretkenlik",
];

export const primaryNavigation: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Etkinlikler", href: "/etkinlikler" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Feedback Ver", href: "/geri-bildirim" },
];

/** Masaüstü ☰ menüsünde gösterilen sayfalar */
export const menuNavigation: NavItem[] = [
  { label: "Yönetim", href: "/yonetim" },
  { label: "Başkanlıklar", href: "/baskanliklar" },
  { label: "Topluluklar", href: "/topluluklar" },
  { label: "Webinarlar", href: "/webinarlar" },
  { label: "Sponsorlar", href: "/sponsorlar" },
  { label: "Başvurular", href: "/basvurular" },
];

/** Mobil hamburger menüsü — tüm sayfalar */
export const mobileNavigation: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Yönetim", href: "/yonetim" },
  { label: "Başkanlıklar", href: "/baskanliklar" },
  { label: "Topluluklar", href: "/topluluklar" },
  { label: "Etkinlikler", href: "/etkinlikler" },
  { label: "Webinarlar", href: "/webinarlar" },
  { label: "Blog", href: "/blog" },
  { label: "Sponsorlar", href: "/sponsorlar" },
  { label: "Başvurular", href: "/basvurular" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Feedback Ver", href: "/geri-bildirim" },
  { label: "Nasıl Kullanılır?", href: "/howto" },
];

/** Footer ve diğer listeler için tam navigasyon */
export const navigation: NavItem[] = mobileNavigation;

export const vision = [
  "NEXRISE'in vizyonu; teknoloji, girişimcilik, yapay zekâ ve inovasyon alanlarında bireyleri, girişimleri ve profesyonelleri ortak bir ekosistemde buluşturan, uluslararası ölçekte tanınan, güvenilir ve sürdürülebilir bir topluluk olmaktır.",
  "Bilginin, üretimin ve iş birliğinin sınır tanımadığı bir dünyada; gençlerin potansiyellerini keşfetmelerine, ekipler kurmalarına, projeler geliştirmelerine ve küresel ölçekte değer üreten girişimlere dönüşmelerine katkı sağlamayı hedefliyoruz.",
  "NEXRISE olarak hedefimiz; eğitimler, webinarlar, zirveler, mentorluk programları, teknoloji toplulukları ve güçlü network ağıyla dünyanın farklı ülkelerinden bireyleri bir araya getiren, yeni fikirlerin doğmasına, girişimlerin büyümesine ve geleceğin liderlerinin yetişmesine katkı sağlayan öncü bir ekosistem oluşturmaktır.",
  "Çünkü biz yalnızca bugünü değil, geleceği inşa edecek nesilleri bir araya getirmeyi hedefliyoruz.",
] as const;

export const mission = [
  "NEXRISE'in misyonu; teknoloji, girişimcilik, yapay zekâ, inovasyon ve kariyer alanlarında bireyleri aynı çatı altında buluşturarak onların gelişimini destekleyen, güçlü iş birlikleri oluşturan ve sürdürülebilir bir ekosistem inşa etmektir.",
  "Webinarlar, eğitimler, zirveler, networking etkinlikleri ve topluluk çalışmaları düzenleyerek bireylerin bilgiye, fırsatlara ve doğru insanlara erişimini kolaylaştırıyoruz. Teknoloji haberlerinden girişimcilik ekosistemine, iş ve staj fırsatlarından Erasmus ve uluslararası programlara kadar üyelerimize değer katacak içerikleri düzenli olarak paylaşıyoruz.",
  "Kadın girişimcilerin desteklenmesine, gençlerin teknoloji ve girişimcilik ekosistemine kazandırılmasına, fikirlerin projeye dönüşmesine ve ekiplerin kurulmasına katkı sağlıyoruz. Girişimcilik platformumuz aracılığıyla girişim fikirlerinin gelişmesini teşvik ediyor, mentorluk desteği sunuyor ve iş birliklerinin doğmasını sağlıyoruz.",
  "NEXRISE yalnızca etkinlik düzenleyen bir topluluk değildir; insanların kendilerini ait hissedebileceği, birlikte öğrenebileceği, üretebileceği ve geleceğe birlikte yürüyebileceği güçlü bir topluluk kültürü oluşturmayı hedefleyen bağımsız bir ekosistemdir. Amacımız, bireyleri yalnızca bugünün fırsatlarıyla değil, geleceğin liderleri ve girişimleriyle de buluşturarak ulusal ve uluslararası ölçekte değer üreten bir topluluk oluşturmaktır.",
] as const;

export const values = [
  "Güven",
  "Şeffaflık",
  "Disiplin",
  "Üretkenlik",
  "Takım Ruhu",
  "Sürekli Gelişim",
  "İnovasyon",
  "Liderlik",
];

export const stats = [
  { value: "81", label: "İl Kapsamı" },
  { value: "6", label: "Başkanlık" },
  { value: "5", label: "Resmî Kanal" },
  { value: "1", label: "Yönetim Kurulu" },
];

function dept(
  slug: keyof typeof handbookPresidencies,
  title: string,
  icon: string,
  highlights: string[],
  responsibilities: string[],
): Community {
  const h = handbookPresidencies[slug];
  return {
    slug,
    title,
    description: h.summary,
    longDescription: h.detail,
    icon,
    highlights,
    responsibilities,
  };
}

export const departments: Community[] = [
  dept("teknoloji", "Teknoloji Başkanlığı", "cpu", ["Hackathon", "Teknik webinarlar", "Açık kaynak", "Sektör iş birlikleri"], ["Teknik eğitim takvimi", "Hackathon organizasyonu", "Mentor koordinasyonu", "Teknoloji içerik üretimi"]),
  dept("girisimcilik", "Girişimcilik Başkanlığı", "rocket", ["Startup mentorluğu", "Pitch geceleri", "Yatırımcı ağı", "Ekip kurma"], ["Pitch etkinlikleri", "Mentorluk programı", "Startup ekibi oluşturma", "Girişimcilik içerikleri"]),
  dept("kadin-girisimcilik", "Kadın Girişimcilik Başkanlığı", "users", ["Liderlik programları", "Başarı hikâyeleri", "Networking", "Kariyer gelişimi"], ["Kadın liderlik webinarları", "Networking etkinlikleri", "Mentor eşleştirme", "Kampanya yönetimi"]),
  dept("lise", "Lise Başkanlığı", "graduation-cap", ["Gençlik programları", "Okul iş birlikleri", "Liderlik eğitimi", "Erken inovasyon"], ["Lise etkinlik takvimi", "Okul ortaklıkları", "Genç mentor programı", "Lise içerik üretimi"]),
  dept("sosyal-medya", "Sosyal Medya Başkanlığı", "share-2", ["Instagram & YouTube", "İçerik stratejisi", "Video prodüksiyon", "Topluluk büyümesi"], ["Sosyal medya takvimi", "Görsel ve video üretimi", "Marka rehberi uyumu", "Etkileşim analizi"]),
  dept("etkinlik", "Etkinlik Başkanlığı", "calendar", ["Zirve organizasyonu", "Atölye yönetimi", "Kayıt süreçleri", "Konuşmacı koordinasyonu"], ["Etkinlik takvimi", "Kayıt ve check-in", "Teknik koordinasyon", "Etkinlik raporlama"]),
];

/** @deprecated Use departments */
export const communities = departments;

export const communityGroups = [
  {
    slug: "instagram",
    title: "Instagram",
    description: "Güncel duyurular, etkinlik görselleri ve topluluk içerikleri. @nexriseoff",
    href: "https://www.instagram.com/nexriseoff",
    platform: "instagram" as const,
  },
  {
    slug: "youtube",
    title: "YouTube",
    description: "Webinar kayıtları, eğitim videoları ve NEXRISE etkinlikleri. @nexriseoffical",
    href: "https://youtube.com/@nexriseoffical",
    platform: "youtube" as const,
  },
  {
    slug: "linkedin-destek",
    title: "LinkedIn",
    description: "Profesyonel network, kariyer duyuruları ve LinkedIn Destek Grubu.",
    href: "https://www.linkedin.com/company/kizil-elma-hamlesi%CC%87/",
    platform: "linkedin" as const,
  },
  {
    slug: "whatsapp-kanal",
    title: "WhatsApp Kanalı",
    description: "Etkinlik, eğitim, burs ve kariyer fırsatlarının anlık duyuruları.",
    href: "https://whatsapp.com/channel/0029Vb8lnMLCBtxMojPS2l1A",
    platform: "whatsapp" as const,
  },
  {
    slug: "sohbet-tanisma",
    title: "WhatsApp Topluluğu",
    description: "NEXRISE Sohbet & Tanışma Grubu — fikir alışverişi, networking ve iş birlikleri.",
    href: "https://chat.whatsapp.com/ETX3zgpD6eA69JHLnejHNE",
    platform: "whatsapp" as const,
  },
];

export const webinars: Webinar[] = [
  {
    slug: "nexrise-ai-techtalks-seo-geo",
    title: "NEXRISE AI TECHTALKS — Yeni Nesil SEO, GEO ve Kariyer Teknolojileri",
    description:
      "Yapay zeka destekli SEO, GEO ve kariyer teknolojilerinde yeni nesil çözümler.",
    longDescription:
      "NEXRISE AI TECHTALKS serisinde Spindora (Yapay Zeka destekli SEO & GEO aracı) ve Aianabasis (Yapay Zeka destekli kariyer platformu) özel konuk Batuhan Yalçın ile ele alındı. Yapay zeka ile güçlenen yeni nesil SEO ve kariyer teknolojileriyle dijital dünyada bir adım öne geçmek için tasarlanmış bir oturum.",
    date: "2026-06-02",
    time: "20:00",
    duration: "90 dk",
    speaker:
      "Batuhan Yalçın — Kıdemli Tam Yığın ve SEO Mühendisi, Spindora Dijital Pazarlama ve SEO Hizmetleri A.Ş.",
    status: "recorded",
    platform: "Google Meet",
    topics: ["SEO", "GEO", "Yapay Zeka", "Kariyer Teknolojileri", "Spindora", "Aianabasis"],
    registrationOpen: false,
  },
  {
    slug: "etkili-iletisim-teknikleri",
    title: "Etkili İletişim Teknikleri",
    description:
      "İletişimde fark yaratmak, ilişkileri güçlendirmek ve etkili bir etki bırakmak için doğru teknikler.",
    longDescription:
      "Ücretsiz NEXRISE webinarında Gaye Erkan ile iletişimde fark yaratmak, ilişkileri güçlendirmek ve etkili bir etki bırakmak için doğru teknikleri keşfettik.",
    date: "2026-06-10",
    time: "20:00",
    duration: "60 dk",
    speaker: "Gaye Erkan — İşe Alım Uzmanı, Eğitmen",
    status: "recorded",
    platform: "Google Meet",
    topics: ["İletişim", "Kariyer", "İşe Alım", "Soft Skills"],
    registrationOpen: false,
  },
];

export const events: Event[] = [];

export const blogPosts: BlogPost[] = [
  {
    slug: "nexrise-topluluk-kurallari",
    title: "NEXRISE Topluluk Kuralları",
    excerpt: "El kitabımızdaki topluluk kuralları, değerler ve çalışma esasları.",
    category: "Topluluk",
    tags: ["Kurallar", "El Kitabı", "NEXRISE"],
    date: "2026-01-20",
    readTime: "4 dk",
  },
];

export const applicationTypes: { value: ApplicationType; label: string; description: string }[] = [
  { value: "management", label: "Yönetim", description: "Yönetim kurulu ve üst düzey liderlik pozisyonları." },
  { value: "volunteer", label: "Gönüllü", description: "Etkinlik, içerik ve operasyon gönüllülüğü." },
  { value: "presidency", label: "Başkanlık", description: "Başkanlık ekiplerine katılım ve liderlik başvuruları." },
  { value: "mentor", label: "Mentor", description: "Üyelere deneyim aktarımı ve mentorluk desteği." },
  { value: "speaker", label: "Konuşmacı", description: "Webinar ve etkinliklerde konuşmacı olmak." },
  { value: "sponsor", label: "Sponsor", description: "Kurumsal sponsorluk ve destek modelleri." },
  { value: "partner", label: "Partner", description: "Stratejik iş birliği ve ortaklık başvuruları." },
];

export const management: TeamMember[] = [
  {
    name: "Berat Çağatay",
    role: "Yönetim Kurulu Başkanı",
    subtitle: "Founder & Chairman of the Board · Technology Entrepreneur",
    department: "Yönetim Kurulu",
    image: "/team/berat-cagatay.png",
    bio: "NEXRISE'in kurucusu ve Yönetim Kurulu Başkanı. Teknoloji girişimcisi olarak gençlik ekosisteminde inovasyon ve girişimcilik kültürünü yaygınlaştırmayı hedefler.",
  },
];

export const boardMembers = management;

export const sponsors: Sponsor[] = [];

export const faq: FAQItem[] = [
  {
    question: "NEXRISE nedir?",
    answer:
      "NEXRISE; teknoloji, girişimcilik, yapay zekâ, inovasyon ve kariyer alanlarında bireyleri, girişimleri ve profesyonelleri aynı ekosistemde buluşturan bağımsız bir topluluk platformudur. Rise of the Next Generation.",
  },
  {
    question: "Kimler katılabilir?",
    answer:
      "Lise ve üniversite öğrencileri, genç profesyoneller, girişimciler ve teknolojiye ilgi duyan herkes katılabilir. Türkiye'nin 81 ilinden bireyleri ağımıza davet ediyoruz.",
  },
  {
    question: "Katılım ücretli mi?",
    answer:
      "Hayır. NEXRISE topluluk odaklı bir ekosistemdir. Etkinliklerin ve webinarların büyük çoğunluğu ücretsizdir.",
  },
  {
    question: "Etkinliklerden nasıl haberdar olurum?",
    answer:
      "Instagram, YouTube, LinkedIn hesaplarımızı takip edin ve WhatsApp Kanalımıza katılın.",
  },
  {
    question: "Şirketler NEXRISE ile nasıl iş birliği yapabilir?",
    answer:
      "NEXRISE'in şu an resmî bir sponsoru bulunmamaktadır. Gelecekte iş birliği yapmak isteyen kurumlar sponsorlar sayfasındaki form veya başvurular bölümünden bize ulaşabilir.",
  },
];

export const social: SocialLink[] = [
  { name: "Instagram", label: "Instagram", subtitle: "@nexriseoff", href: "https://www.instagram.com/nexriseoff", icon: "instagram" },
  { name: "YouTube", label: "YouTube", subtitle: "@nexriseoffical", href: "https://youtube.com/@nexriseoffical", icon: "youtube" },
  { name: "LinkedIn", label: "LinkedIn", subtitle: "NEXRISE", href: "https://www.linkedin.com/company/kizil-elma-hamlesi%CC%87/", icon: "linkedin" },
  { name: "WhatsApp Kanalı", label: "WhatsApp Kanalı", subtitle: "Duyuru kanalı", href: "https://whatsapp.com/channel/0029Vb8lnMLCBtxMojPS2l1A", icon: "whatsapp" },
  { name: "WhatsApp Topluluğu", label: "WhatsApp Topluluğu", subtitle: "Sohbet & tanışma", href: "https://chat.whatsapp.com/ETX3zgpD6eA69JHLnejHNE", icon: "whatsapp" },
];

export const joinMessage = {
  title: "NEXRISE Ekosistemine Katılın",
  description:
    "En güncel duyurular, etkinlikler, eğitimler, girişimcilik fırsatları, teknoloji içerikleri ve topluluk faaliyetlerinden haberdar olun.",
  footer:
    "Takip ederek ve topluluğumuza katılarak NEXRISE'in büyümesine destek olabilirsiniz. Birlikte öğreniyor, üretiyor ve geleceği birlikte inşa ediyoruz.",
};

export const announcements: Array<{
  id: string;
  title: string;
  content: string;
  link?: string;
  date: string;
  published: boolean;
}> = [];

export const userRoles = [
  "Ziyaretçi",
  "Üye",
  "Gönüllü",
  "Başkan",
  "Başkan Yardımcısı",
  "Yönetim Kurulu Başkanı",
  "Admin",
] as const;

/** Dashboard demo verisi — Supabase bağlandığında canlı veri ile değişir */
export const dashboardStats = {
  totalMembers: 0,
  totalApplications: 0,
  upcomingWebinars: webinars.filter((w) => w.status === "upcoming").length,
  upcomingEvents: events.filter((e) => e.status === "upcoming").length,
  blogCount: blogPosts.length,
  sponsorCount: sponsors.length,
};

export const recentApplications: DashboardApplication[] = [];

export const recentMessages: DashboardMessage[] = [];

export const applicationTypeLabels: Record<ApplicationType, string> = {
  management: "Yönetim",
  volunteer: "Gönüllü",
  presidency: "Başkanlık",
  mentor: "Mentor",
  speaker: "Konuşmacı",
  sponsor: "Sponsor",
  partner: "Partner",
};

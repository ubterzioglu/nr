/**
 * NEXRISE Kurumsal Yönetim ve Organizasyon El Kitabı — site içerik referansı
 */

export const handbookSocialRules = [
  "NEXRISE platformu siyaset üstüdür; siyasi propaganda ve kutuplaştırıcı içerik paylaşılmaz.",
  "Argo, hakaret, küfür ve aşağılayıcı ifadeler kesinlikle yasaktır.",
  "Cinsiyet, din, dil, ırk veya herhangi bir ayrım temelli ayrımcılık kabul edilmez.",
  "İzinsiz reklam, spam ve topluluk kurallarına aykırı tanıtım yapılamaz.",
  "Tüm iletişim yapıcı, saygılı ve profesyonel olmalıdır.",
  "Gizlilik ve kişisel veriler korunur; başkalarının bilgileri izinsiz paylaşılmaz.",
  "Ekip içi ve topluluk içi süreçlerde disiplin, şeffaflık ve takım ruhu esastır.",
];

export const handbookOrganization = {
  intro:
    "NEXRISE; Yönetim Kurulu Başkanı liderliğinde, Başkan Yardımcıları ve Başkanlık sistemiyle organize edilen hibrit bir yapıya sahiptir.",
  chairman:
    "Yönetim Kurulu Başkanı ekosistemin genel stratejisini belirler, kurumsal temsili üstlenir ve tüm başkanlıkları koordine eder.",
  vicePresidents: [
    {
      title: "Başkan Yardımcısı — Teknoloji & Girişimcilik",
      scope: "Teknoloji ve Girişimcilik başkanlıklarının koordinasyonu, teknik projeler ve startup ekosistemi.",
    },
    {
      title: "Başkan Yardımcısı — Lise & Kadın Girişimcilik",
      scope: "Lise Başkanlığı ve Kadın Girişimcilik Başkanlığı koordinasyonu, gençlik ve topluluk programları.",
    },
  ],
};

/** El kitabındaki başkanlık tanımları (özet + detay) */
export const handbookPresidencies = {
  teknoloji: {
    summary:
      "Yapay zekâ, yazılım, siber güvenlik ve inovasyon odaklı eğitimler, hackathonlar ve proje geliştirme programları.",
    detail:
      "Teknoloji Başkanlığı; NEXRISE'in teknik üretim gücünü temsil eder. Üyelerin yazılım, AI, siber güvenlik ve veri alanlarında gelişmesini sağlayan eğitimler, hackathonlar ve açık kaynak projeleri yürütür.",
  },
  girisimcilik: {
    summary:
      "Girişim fikirlerini projeye dönüştürme, mentorluk, ekip kurma ve girişimcilik ekosistemi iş birlikleri.",
    detail:
      "Girişimcilik Başkanlığı; fikir aşamasındaki projelerden erken aşama startuplara kadar girişimcileri destekler. Pitch, mentorluk ve yatırımcı network programları bu başkanlığın çekirdeğidir.",
  },
  "kadin-girisimcilik": {
    summary:
      "Kadın girişimcileri destekleyen webinarlar, networking etkinlikleri ve ilham verici içerikler.",
    detail:
      "Kadın Girişimcilik Başkanlığı; teknoloji ve girişimcilik alanında kadın liderliğini güçlendirir. Mentorship, başarı hikâyeleri ve kariyer gelişim programları sunar.",
  },
  lise: {
    summary:
      "Lise öğrencilerini girişimcilik ve teknoloji ekosistemine erken yaşta dahil eden projeler.",
    detail:
      "Lise Başkanlığı; gençleri erken yaşta inovasyon kültürüyle tanıştırır. Okul iş birlikleri, gençlik liderlik programları ve lise düzeyinde proje yarışmaları düzenler.",
  },
  "sosyal-medya": {
    summary:
      "Dijital platformlarda profesyonel içerik üretimi ve kurumsal kimlik yönetimi.",
    detail:
      "Sosyal Medya Başkanlığı; Instagram, YouTube ve diğer kanallarda NEXRISE markasını temsil eder. İçerik stratejisi, video prodüksiyon ve topluluk büyümesinden sorumludur.",
  },
  etkinlik: {
    summary:
      "Zirve, atölye, konferans ve networking etkinliklerinin planlanması ve yürütülmesi.",
    detail:
      "Etkinlik Başkanlığı; zirve, workshop ve networking etkinliklerini uçtan uca yönetir. Kayıt, konuşmacı koordinasyonu ve katılımcı deneyimi bu başkanlığın sorumluluğundadır.",
  },
};

export const handbookWorkingPrinciples = [
  "Karar alma süreçleri şeffaf ve ekip odaklıdır.",
  "Her başkanlık kendi alanında sorumluluk üstlenir ve raporlama yapar.",
  "Topluluk üyeleri gönüllülük esasına göre katkı sunar.",
  "Etkinlik, eğitim, burs ve kariyer fırsatları topluluğa hızlı ulaştırılır.",
  "Kurumsal kimlik ve logo kullanım kurallarına uyulur.",
];

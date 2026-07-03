/**
 * Admin paneli ana sayfasındaki genel bilgilendirme kartı ve
 * modül kullanım kılavuzu (akordeon) içerikleri.
 */

export const adminGuideIntro = {
  title: "NEXRISE Yönetim Paneline Hoş Geldiniz",
  paragraphs: [
    "Bu panel; etkinlik, webinar, içerik, başvuru ve topluluk süreçlerinin tek merkezden yönetildiği yerdir. Panelde yaptığınız yayın değişiklikleri yaklaşık 1 dakika içinde sitede görünür hâle gelir.",
    "Her modülün nasıl kullanıldığını aşağıdaki kılavuz kartlarında bulabilirsiniz. Yeni eklenen özellikler sol menüdeki Güncellemeler sekmesinde duyurulur.",
  ],
  warning:
    "Sildiğiniz kayıtlar geri alınamaz. Bir içeriği kaldırmak istediğinizde önce yayından kaldırmayı (taslağa çekmeyi) tercih edin.",
};

export interface AdminGuideModule {
  id: string;
  icon: string;
  title: string;
  steps: string[];
}

export const adminGuideModules: AdminGuideModule[] = [
  {
    id: "updates",
    icon: "🆕",
    title: "Güncellemeler",
    steps: [
      "Panele eklenen yeni özellikler ve değişiklikler bu sekmede tarih sırasıyla duyurulur.",
      "Yeni bir özellik kullanıma açıldığında açıklamasını burada bulabilirsiniz.",
    ],
  },
  {
    id: "dashboard",
    icon: "📊",
    title: "Dashboard",
    steps: [
      "Panelin özet ekranıdır: üye sayısı, yaklaşan etkinlikler, bekleyen başvurular ve son mesajlar burada görünür.",
      "Kartların üzerindeki ok simgeleriyle ilgili modüle hızlıca geçebilirsiniz.",
    ],
  },
  {
    id: "events",
    icon: "📅",
    title: "Etkinlikler",
    steps: [
      "Yeni etkinlik oluştururken başlık, açıklama, tarih/saat, konuşmacı, konum, kontenjan ve kapak görseli girilir.",
      "Katılım linki (Zoom/Meet/Teams) yalnızca kayıt olan katılımcılara e-posta ile gönderilir; sitede gösterilmez.",
      "Etkinlik 'Yayınla' denmedikçe sitede görünmez — önce taslak olarak hazırlayıp kontrol edebilirsiniz.",
      "Etkinlik satırındaki katılımcı listesinden kayıtları görebilir, CSV olarak indirebilirsiniz.",
    ],
  },
  {
    id: "webinars",
    icon: "🎤",
    title: "Webinarlar",
    steps: [
      "Etkinliklerle aynı mantıkla çalışır; ek olarak kayıt (video) linki ve 'öne çıkan' işareti vardır.",
      "Webinar bittikten sonra kayıt linkini ekleyip yayında tutarsanız site ziyaretçileri kaydı izleyebilir.",
    ],
  },
  {
    id: "applications",
    icon: "📋",
    title: "Başvurular",
    steps: [
      "Gönüllü, başkanlık, yönetim, mentor, konuşmacı ve sponsor başvuruları burada listelenir.",
      "Her başvuruyu Bekliyor / Onaylandı / Reddedildi olarak işaretleyebilirsiniz.",
      "Tür filtresiyle yalnızca belirli başvuru tipini görüntüleyebilirsiniz.",
    ],
  },
  {
    id: "contacts",
    icon: "📬",
    title: "İletişim Mesajları",
    steps: [
      "Bize Ulaşın formundan gelen mesajlar hem buraya düşer hem bildirim e-postası olarak gönderilir.",
      "Okuduğunuz mesajları 'Okundu' işaretleyerek gelen kutusunu düzenli tutabilirsiniz.",
    ],
  },
  {
    id: "blog",
    icon: "📰",
    title: "Blog / Haberler / Duyurular",
    steps: [
      "Blog yazısı, haber ve duyurular kategori seçilerek eklenir (yakında canlı CRUD'a bağlanacak).",
      "Yayın tarihi ileri bir tarih seçilirse içerik o tarihte görünür olur.",
    ],
  },
  {
    id: "sponsors",
    icon: "🏢",
    title: "Sponsorlar",
    steps: [
      "Sponsor eklerken logo, web sitesi, açıklama ve sponsorluk paketi (tier) girilir.",
      "Sıralama değeri küçük olan sponsor sitede daha önce gösterilir.",
    ],
  },
  {
    id: "board",
    icon: "👥",
    title: "Yönetim Kadrosu ve Başkanlıklar",
    steps: [
      "Yönetim kurulu üyeleri ve başkanlık (departman) içerikleri buradan güncellenir.",
      "Fotoğraf ve görev bilgisi değişikliklerinde kaydetmeyi unutmayın.",
    ],
  },
  {
    id: "settings",
    icon: "⚙️",
    title: "Site Ayarları",
    steps: [
      "Sosyal medya bağlantıları, iletişim adresleri ve genel site ayarları buradan yönetilecek.",
      "Bu modül aktifleştikçe kılavuzu güncellenecektir.",
    ],
  },
];

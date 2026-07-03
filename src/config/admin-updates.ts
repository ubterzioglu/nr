export type AdminUpdateTag = "yeni" | "iyileştirme" | "duyuru";

export interface AdminUpdate {
  /** ISO tarih (YYYY-MM-DD) — listede en yeni en üstte gösterilir. */
  date: string;
  title: string;
  description: string;
  tag: AdminUpdateTag;
}

/**
 * Admin paneli "Güncellemeler" sekmesinin içeriği.
 * Her özellik teslimatında buraya bir kayıt eklenir; kodla birlikte
 * versiyonlanır, veritabanı gerektirmez.
 */
export const adminUpdates: AdminUpdate[] = [
  {
    date: "2026-07-03",
    title: "Veritabanı altyapısı canlıya alındı ve güvenlik doğrulandı",
    description:
      "Tüm veritabanı migrasyonları (001–004) canlı Supabase projesine uygulandı: etkinlik kayıtları, mail günlüğü, sertifikalar, revizyon istekleri, görev/toplantı ve denetim kaydı tabloları dahil 21 tablo hazır. Üyelik trigger'ı, 7 rol tanımı ve 4 dosya deposu (etkinlik görselleri, avatarlar, sertifikalar, dokümanlar) aktif. Güvenlik kontrolünden geçti: 21 tablonun tamamında satır seviyesi güvenlik (RLS) açık; Zoom/Meet katılım linkleri siteden okunamaz, yalnızca kayıt onay mailiyle paylaşılır.",
    tag: "duyuru",
  },
  {
    date: "2026-07-03",
    title: "Faz 3 tamamlandı: içerik, üyeler, topluluk ve ayarlar",
    description:
      "Blog/Haber/Duyuru yönetimi canlıya bağlandı. Kullanıcı yönetimi (rol atama, pasife alma, üye geçmişi), üye profili (/profil — kayıtlarım ve sertifikalarım), sponsor yönetimi, site ayarları (ana sayfa hero + sosyal bağlantılar), revizyon istekleri (üye önerileri + yorumlar), yönetim kadrosu/başkanlık/görev-toplantı modülleri ve denetim kaydı eklendi.",
    tag: "yeni",
  },
  {
    date: "2026-07-03",
    title: "Yoklama, sertifika sistemi ve mail merkezi",
    description:
      "Katılımcı listesinde katıldı/katılmadı işaretleme ve toplu yoklama eklendi. Katılanlara tek tıkla QR doğrulama kodlu PDF sertifika üretilip mail ediliyor (/sertifika-dogrula ile doğrulanabilir). Mail Merkezi'nden etkinlik kayıtlılarına, katılanlara veya bülten abonelerine toplu mail gönderilebiliyor; etkinliklerden 1 gün / 1 saat / 15 dk önce otomatik hatırlatma altyapısı hazır (CRON_SECRET ile zamanlayıcı kurulumu gerekir).",
    tag: "yeni",
  },
  {
    date: "2026-07-03",
    title: "Gerçek kayıt sistemi ve otomatik onay maili",
    description:
      "Etkinlik/webinar kayıtları artık kontenjan kontrolü ve çift kayıt engeliyle veritabanına işleniyor. Katılımcıya takvim daveti (ICS + Google Takvim) ve iptal bağlantısı içeren otomatik onay maili gönderiliyor; katılım linki yalnızca bu mailde yer alıyor. Girişli üyeler tek tıkla katılabiliyor.",
    tag: "yeni",
  },
  {
    date: "2026-07-03",
    title: "Etkinlik ve webinar yönetimi",
    description:
      "Etkinlikler ve Webinarlar modülleri canlıya bağlandı: oluşturma, düzenleme, kapak görseli yükleme, kontenjan ve katılım linki tanımlama, yayınlama/yayından kaldırma ve silme bu panelden yapılıyor.",
    tag: "yeni",
  },
  {
    date: "2026-07-03",
    title: "Admin paneli kılavuzu ve Güncellemeler sekmesi",
    description:
      "Panel ana sayfasına modül kullanım kılavuzu (akordeon kartlar) ve bu Güncellemeler sekmesi eklendi. Yeni özellik teslimatları burada duyurulacak.",
    tag: "duyuru",
  },
  {
    date: "2026-07-03",
    title: "Rol tabanlı admin girişi",
    description:
      "Admin paneline artık kişisel hesapla (e-posta + şifre) giriş yapılıyor. Ortak yönetici şifresi geçiş dönemi boyunca açık; admin hesapları atandıktan sonra kapatılacak.",
    tag: "yeni",
  },
  {
    date: "2026-07-03",
    title: "Üyelik sistemi altyapısı",
    description:
      "Siteye üye kayıt (/kayit), giriş (/giris), Google ile giriş, e-posta doğrulama ve şifre sıfırlama akışları eklendi. Etkinlik kayıtları yakında üye hesaplarıyla ilişkilendirilecek.",
    tag: "yeni",
  },
  {
    date: "2026-07-03",
    title: "KVKK uyumluluğu",
    description:
      "KVKK aydınlatma metni sayfası (/kvkk) yayınlandı; kişisel veri toplayan tüm formlara zorunlu açık rıza onayı eklendi.",
    tag: "iyileştirme",
  },
];

# NEXRISE — Kurumsal Web Platformu
**MASTER.md**

> Bu doküman, NEXRISE'in kurumsal web platformunun tek referans kaynağıdır.  
> Logo, renk, içerik, sayfalar, admin panel ve yönetilebilir sistem **bu dosyaya göre** kurulacaktır.

---

## 1. NEXRISE Kimdir?

**NEXRISE**, teknoloji, girişimcilik, inovasyon, kariyer ve network odaklı **bağımsız bir ekosistemdir**.

Öğrenciler, girişimciler, yazılımcılar, startup kurucuları, profesyoneller, mentorlar ve şirketleri tek çatı altında buluşturur. Amaç; birlikte öğrenmek, üretmek, iş birliği yapmak ve büyümektir.

| | |
|---|---|
| **Marka** | NEXRISE |
| **Slogan** | *Rise of the Next Generation* |
| **Türkçe motto** | Birlikte Üretiyor, Birlikte Yükseliyoruz. |
| **Konum** | İstanbul, Türkiye |
| **Kapsam** | Türkiye — 81 il |

---

## 2. Logo & Renk Sistemi

**Resmî NEXRISE logosu birincil marka varlığıdır. Logo yeniden tasarlanmayacak.**

Tüm UI — tipografi, butonlar, gradientler, ikonlar, header, footer — **logodan türetilecek**.

| Rol | Renk | Kullanım |
|---|---|---|
| Primary | `#1D6FFF` | CTA, linkler, vurgular |
| Secondary | `#2AA7FF` | Gradient, hover |
| Dark / Lacivert | `#050B1A` | Hero, footer, koyu zemin |
| White | `#FFFFFF` | Metin, kart zeminleri |
| Background | `#F8FAFC` | Açık gri — sayfa arka planı |
| Accent | `#5CC8FF` | Glow, badge, ikincil vurgu |

**Tasarım dili:** Modern · Premium · Minimal · Kurumsal  
**Referans hissiyat:** Apple · Stripe · Vercel · Linear

---

## 3. İçerik Kaynağı

Ana referans: **NEXRISE Kurumsal Yönetim ve Organizasyon El Kitabı**

Bu kitapçıktan alınacaklar:
- Vizyon & misyon
- Temel değerler (Disiplin, Sorumluluk, Üretkenlik, Şeffaflık, Takım Ruhu, Sürekli Gelişim, Yenilikçilik, Girişimcilik)
- Organizasyon yapısı & yönetim kadrosu
- 6 başkanlık tanımı ve görevleri
- Topluluk kuralları & çalışma esasları

Site metinleri kitapçıkla **tutarlı** olmalı; uydurma içerik kullanılmamalı.

---

## 4. Sayfalar

| # | Sayfa | Route | İçerik özeti |
|---|---|---|---|
| 1 | Ana Sayfa | `/` | Hero, tanıtım, vizyon/misyon, istatistik, başkanlıklar, etkinlikler, webinarlar, sponsorlar, SSS, CTA |
| 2 | Hakkımızda | `/hakkimizda` | Hikaye, misyon, vizyon, değerler |
| 3 | Yönetim | `/yonetim` | Yönetim kurulu, başkan yardımcıları, organizasyon |
| 4 | Başkanlıklar | `/baskanliklar` | 6 departman + detay sayfaları |
| 5 | Topluluklar | `/topluluklar` | LinkedIn Destek, Sohbet & Tanışma grupları |
| 6 | Etkinlikler | `/etkinlikler` | Yaklaşan & geçmiş etkinlikler, kayıt |
| 7 | Webinarlar | `/webinarlar` | Canlı & kayıtlı oturumlar |
| 8 | Blog | `/blog` | Kategori, etiket, arama, SEO |
| 9 | Sponsorlar | `/sponsorlar` | Partner logoları, sponsor ol formu |
| 10 | Başvurular | `/basvurular` | Yönetim, gönüllü, etkinlik başvuruları |
| 11 | İletişim | `/iletisim` | Form + sosyal bağlantılar |
| — | Gizlilik Politikası | `/gizlilik-politikasi` | KVKK uyumlu |
| — | Kullanım Şartları | `/kullanim-sartlari` | Topluluk kuralları özeti |
| — | 404 | — | Marka uyumlu hata sayfası |

---

## 5. Sosyal Bağlantılar

Footer ve iletişim sayfasında **zorunlu**:

| Platform | Link |
|---|---|
| Instagram | https://www.instagram.com/nexriseoff |
| YouTube | https://youtube.com/@nexriseoffical |
| LinkedIn (NEXRISE) | https://www.linkedin.com/company/kizil-elma-hamlesi%CC%87/ |
| WhatsApp Kanalı | https://whatsapp.com/channel/0029Vb8lnMLCBtxMojPS2l1A |
| WhatsApp Topluluğu | https://chat.whatsapp.com/ETX3zgpD6eA69JHLnejHNE |

---

## 6. Admin Panel *(kesin gereksinim)*

`/admin` — yalnızca yetkili kullanıcılar.

| Modül | Yapılacaklar |
|---|---|
| Etkinlikler | Ekle · düzenle · sil · yayınla |
| Webinarlar | Ekle · düzenle · kayıt linki |
| Blog | Ekle · düzenle · kategori & etiket |
| Başvurular | Görüntüle · durum güncelle |
| Sponsorlar | Logo yükle · tier yönet |
| Ekip / Yönetim | Kadro güncelle · fotoğraf |
| Başkanlıklar | Departman içerik yönetimi |
| Duyurular | Site geneli duyuru yayını |
| İletişim | Gelen mesajları görüntüle |
| Ayarlar | Site genel ayarları |

**Roller:** Ziyaretçi → Üye → Gönüllü → Başkan → Başkan Yardımcısı → YK Başkanı → Admin

---

## 7. Teknoloji

| Katman | Seçim |
|---|---|
| Frontend | Next.js · TypeScript · Tailwind CSS · App Router |
| UI | Shadcn UI · Framer Motion · Lucide Icons |
| Backend / DB | Supabase (Auth · PostgreSQL · Storage) |
| Formlar | React Hook Form · Zod |
| Deploy | Vercel |
| Repo | GitHub |

**Supabase tabloları:** `users` · `roles` · `events` · `webinars` · `blogs` · `applications` · `departments` · `board_members` · `sponsors` · `contacts` · `announcements` · `settings`

---

## 8. Teslim Kriterleri

- [ ] Tüm sayfalar MASTER.md'ye uygun ve Türkçe
- [ ] Logo & renk sistemi tutarlı uygulanmış
- [ ] İçerik el kitabıyla uyumlu
- [ ] Admin panel çalışır durumda
- [ ] Formlar Supabase'e kaydediyor
- [ ] Sosyal linkler doğru
- [ ] Mobile first · responsive · dark mode
- [ ] SEO (meta, sitemap, robots)
- [ ] `.env.example` · `README.md` · GitHub repo
- [ ] Vercel'e deploy edilebilir (`npm install` → `npm run dev`)

---

## 9. Genel Hedef

Bu proje yalnızca bir tanıtım sitesi değildir.

**NEXRISE'in uzun vadede büyüyebilecek, yönetilebilir, ölçeklenebilir ve kurumsal bir teknoloji platformuna dönüşmesini sağlayacak sağlam bir altyapı** oluşturulacaktır.

Tüm geliştirmeler modüler, temiz kod prensiplerine uygun ve gelecekte yeni özelliklerin kolayca eklenebileceği şekilde planlanmalıdır.

---

*NEXRISE Yönetim Kurulu · 2026*

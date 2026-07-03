import { brand, social } from "@/config/site";
import { createServerClient } from "@/lib/supabase/client";
import { getHeroSettings, getSocialLinkSettings } from "@/lib/data/settings";
import {
  HeroSettingsForm,
  SocialSettingsForm,
} from "@/components/admin/settings-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function configSocialHref(name: string): string {
  return social.find((link) => link.name === name)?.href ?? "";
}

export default async function AdminSettingsPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Site Ayarları</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için ayarlar yönetimi kullanılamıyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const [heroSettings, socialSettings] = await Promise.all([
    getHeroSettings(),
    getSocialLinkSettings(),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Site Ayarları</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Ana sayfa (mvpubt) hero içeriği ve sosyal medya bağlantıları buradan
        yönetilir; değişiklikler yaklaşık 1 dakika içinde sitede görünür.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Ana Sayfa (Hero) İçeriği</CardTitle>
        </CardHeader>
        <CardContent>
          <HeroSettingsForm
            initial={{
              title: heroSettings?.title ?? brand.slogan,
              description: heroSettings?.description ?? brand.description,
              primaryCtaLabel: heroSettings?.primaryCtaLabel ?? "Topluluğa Katıl",
              primaryCtaHref: heroSettings?.primaryCtaHref ?? "/basvurular",
              secondaryCtaLabel: heroSettings?.secondaryCtaLabel ?? "Etkinlikleri Keşfet",
              secondaryCtaHref: heroSettings?.secondaryCtaHref ?? "/etkinlikler",
            }}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            Sosyal Medya & Topluluk Bağlantıları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SocialSettingsForm
            initial={{
              instagram: socialSettings?.instagram ?? configSocialHref("Instagram"),
              youtube: socialSettings?.youtube ?? configSocialHref("YouTube"),
              linkedin: socialSettings?.linkedin ?? configSocialHref("LinkedIn"),
              whatsappChannel:
                socialSettings?.whatsappChannel ?? configSocialHref("WhatsApp Kanalı"),
              whatsappCommunity:
                socialSettings?.whatsappCommunity ??
                configSocialHref("WhatsApp Topluluğu"),
              discord: socialSettings?.discord ?? "",
              telegram: socialSettings?.telegram ?? "",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Marka Bilgileri (salt okunur)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Marka:</span> {brand.name}
          </p>
          <p>
            <span className="font-medium">Slogan:</span> {brand.slogan}
          </p>
          <p className="text-muted-foreground">
            Marka adı, logo ve renkler MASTER.md gereği sabittir; değişiklik
            gerekiyorsa geliştirme ekibiyle iletişime geçin.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

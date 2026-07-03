import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AuthSplitCard } from "@/components/shared/auth-split-card";
import { MemberLoginForm } from "@/components/forms/member-login-form";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Üye Girişi",
    description:
      "NEXRISE topluluk üyeleri için giriş sayfası. Üyelik sistemi çok yakında aktif olacak.",
    path: "/uye-girisi",
  }),
  // Mockup aşamasında arama motorlarına kapalı
  robots: { index: false, follow: false },
};

export default function MemberLoginPage() {
  return (
    <AuthSplitCard
      badge="Çok Yakında"
      title="NEXRISE topluluğuna hoş geldin"
      description="Üyelik sistemi yapım aşamasında. Aktif olduğunda etkinlik ve webinar kayıtlarını buradan yöneteceksin."
      features={[
        "Etkinlik ve webinar kayıtları",
        "Topluluk duyuruları",
        "Üye profili",
      ]}
    >
      <MemberLoginForm />
    </AuthSplitCard>
  );
}

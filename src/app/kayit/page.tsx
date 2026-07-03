import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AuthSplitCard } from "@/components/shared/auth-split-card";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = pageMetadata({
  title: "Hesap Oluştur",
  description:
    "NEXRISE topluluğuna üye ol; etkinliklere tek tıkla kaydol, sertifikalarını yönet.",
  path: "/kayit",
});

export default function RegisterPage() {
  return (
    <AuthSplitCard
      badge="Üyelik"
      title="Topluluğa katıl"
      description="Türkiye'nin teknoloji ve girişimcilik topluluğunda yerini al. Üyelik ücretsizdir."
      features={[
        "Etkinlik ve webinarlara hızlı kayıt",
        "Dijital katılım sertifikaları",
        "Topluluk ağına erişim",
      ]}
    >
      <RegisterForm />
    </AuthSplitCard>
  );
}

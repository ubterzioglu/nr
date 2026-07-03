import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AuthSplitCard } from "@/components/shared/auth-split-card";
import { ResetRequestForm } from "@/components/forms/password-reset-forms";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Şifre Sıfırlama",
    description: "NEXRISE üye hesabı şifre sıfırlama.",
    path: "/sifre-sifirla",
  }),
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthSplitCard
      badge="Üyelik"
      title="Şifreni mi unuttun?"
      description="Sorun değil — e-posta adresine göndereceğimiz bağlantıyla yeni bir şifre belirleyebilirsin."
    >
      <ResetRequestForm />
    </AuthSplitCard>
  );
}

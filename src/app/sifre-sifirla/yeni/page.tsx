import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AuthSplitCard } from "@/components/shared/auth-split-card";
import { NewPasswordForm } from "@/components/forms/password-reset-forms";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Yeni Şifre Belirle",
    description: "NEXRISE üye hesabı için yeni şifre belirleme.",
    path: "/sifre-sifirla/yeni",
  }),
  robots: { index: false, follow: false },
};

export default function NewPasswordPage() {
  return (
    <AuthSplitCard
      badge="Üyelik"
      title="Son bir adım"
      description="Hesabın için yeni şifreni belirle ve topluluğa kaldığın yerden devam et."
    >
      <NewPasswordForm />
    </AuthSplitCard>
  );
}

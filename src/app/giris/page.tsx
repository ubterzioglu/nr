import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AuthSplitCard } from "@/components/shared/auth-split-card";
import { MemberLoginForm, type LoginNotice } from "@/components/forms/member-login-form";

export const metadata: Metadata = pageMetadata({
  title: "Üye Girişi",
  description:
    "NEXRISE topluluk üyeleri için giriş sayfası. Etkinlik ve webinar kayıtlarını tek yerden yönet.",
  path: "/giris",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function resolveNotice(params: Record<string, string | string[] | undefined>): LoginNotice | undefined {
  if (params.dogrulandi === "1") return "verified";
  if (params.hata === "dogrulama") return "verify-error";
  if (params.sifre === "yenilendi") return "password-updated";
  return undefined;
}

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <AuthSplitCard
      badge="Üyelik"
      title="NEXRISE topluluğuna hoş geldin"
      description="Etkinlik ve webinar kayıtlarını yönet, sertifikalarına eriş, topluluğun bir parçası ol."
      features={[
        "Tek tıkla etkinlik kaydı",
        "Katılım sertifikaların bir arada",
        "Topluluk duyuruları ve profil",
      ]}
    >
      <MemberLoginForm notice={resolveNotice(params)} />
    </AuthSplitCard>
  );
}

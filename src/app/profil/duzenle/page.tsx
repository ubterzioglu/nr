import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/forms/profile-form";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Profili Düzenle",
    description: "NEXRISE üye profili düzenleme.",
    path: "/profil/duzenle",
  }),
  robots: { index: false, follow: false },
};

export default async function EditProfilePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/giris");

  const profile = currentUser.profile;
  const interests = Array.isArray(profile?.interests)
    ? (profile?.interests as string[])
    : [];

  return (
    <section className="min-h-screen bg-muted/30 pb-20 pt-28">
      <Container className="max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold">Profili Düzenle</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Profil bilgilerin topluluk içinde seni tanıtır; iletişim tercihlerini
          buradan yönetebilirsin.
        </p>
        <ProfileForm
          initial={{
            fullName: profile?.full_name ?? "",
            username: profile?.username ?? "",
            bio: profile?.bio ?? "",
            city: profile?.city ?? "",
            university: profile?.university ?? "",
            highSchool: profile?.high_school ?? "",
            profession: profile?.profession ?? "",
            websiteUrl: profile?.website_url ?? "",
            linkedinUrl: profile?.linkedin_url ?? "",
            githubUrl: profile?.github_url ?? "",
            instagramUrl: profile?.instagram_url ?? "",
            interests,
            newsletterOptIn: profile?.newsletter_opt_in ?? false,
            avatarUrl: profile?.avatar_url ?? null,
            kvkkConsentMissing: !profile?.kvkk_consent_at,
          }}
        />
      </Container>
    </section>
  );
}

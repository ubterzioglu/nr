"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { updateProfile } from "@/lib/actions/profile";
import { interestOptions } from "@/config/interests";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface ProfileFormValues {
  fullName: string;
  username: string;
  bio: string;
  city: string;
  university: string;
  highSchool: string;
  profession: string;
  websiteUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  instagramUrl: string;
  interests: string[];
  newsletterOptIn: boolean;
  avatarUrl: string | null;
  kvkkConsentMissing: boolean;
}

/**
 * Profil düzenleme formu. Alan sayısı yüksek olduğu için RHF yerine
 * doğrudan FormData ile çalışır; asıl doğrulama server action'dadır.
 */
export function ProfileForm({ initial }: { initial: ProfileFormValues }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initial.avatarUrl);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    // checkbox'lar FormData'da "on" gelir; action "true" bekler
    formData.set(
      "newsletterOptIn",
      formData.get("newsletterOptIn") === "on" ? "true" : "false"
    );
    if (formData.get("kvkkConsent") === "on") formData.set("kvkkConsent", "true");

    const result = await updateProfile(formData);
    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    setStatus("success");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
              {avatarPreview && (
                <Image
                  src={avatarPreview}
                  alt="Profil fotoğrafı"
                  fill
                  unoptimized
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <label htmlFor="profile-avatar" className="mb-1.5 block text-sm font-medium">
                Profil Fotoğrafı (JPG/PNG/WebP, en fazla 4 MB)
              </label>
              <input
                id="profile-avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setAvatarPreview(URL.createObjectURL(file));
                }}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-brand-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-primary"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium">
                Ad Soyad *
              </label>
              <Input
                id="profile-name"
                name="fullName"
                defaultValue={initial.fullName}
                required
                minLength={2}
              />
            </div>
            <div>
              <label htmlFor="profile-username" className="mb-1.5 block text-sm font-medium">
                Kullanıcı Adı
              </label>
              <Input
                id="profile-username"
                name="username"
                defaultValue={initial.username}
                placeholder="kucuk harf, rakam, _ ve ."
              />
            </div>
          </div>

          <div>
            <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-medium">
              Kısa Biyografi
            </label>
            <Textarea
              id="profile-bio"
              name="bio"
              rows={3}
              maxLength={500}
              defaultValue={initial.bio}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-city" className="mb-1.5 block text-sm font-medium">
                Şehir
              </label>
              <Input id="profile-city" name="city" defaultValue={initial.city} />
            </div>
            <div>
              <label htmlFor="profile-profession" className="mb-1.5 block text-sm font-medium">
                Meslek
              </label>
              <Input
                id="profile-profession"
                name="profession"
                defaultValue={initial.profession}
              />
            </div>
            <div>
              <label htmlFor="profile-university" className="mb-1.5 block text-sm font-medium">
                Üniversite
              </label>
              <Input
                id="profile-university"
                name="university"
                defaultValue={initial.university}
              />
            </div>
            <div>
              <label htmlFor="profile-highschool" className="mb-1.5 block text-sm font-medium">
                Lise
              </label>
              <Input
                id="profile-highschool"
                name="highSchool"
                defaultValue={initial.highSchool}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">İlgi Alanları</p>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map((interest) => (
                <label
                  key={interest}
                  className="flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-sm"
                >
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    defaultChecked={initial.interests.includes(interest)}
                    className="h-3.5 w-3.5 accent-brand-primary"
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-linkedin" className="mb-1.5 block text-sm font-medium">
                LinkedIn
              </label>
              <Input
                id="profile-linkedin"
                name="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/..."
                defaultValue={initial.linkedinUrl}
              />
            </div>
            <div>
              <label htmlFor="profile-github" className="mb-1.5 block text-sm font-medium">
                GitHub
              </label>
              <Input
                id="profile-github"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/..."
                defaultValue={initial.githubUrl}
              />
            </div>
            <div>
              <label htmlFor="profile-instagram" className="mb-1.5 block text-sm font-medium">
                Instagram
              </label>
              <Input
                id="profile-instagram"
                name="instagramUrl"
                type="url"
                placeholder="https://instagram.com/..."
                defaultValue={initial.instagramUrl}
              />
            </div>
            <div>
              <label htmlFor="profile-website" className="mb-1.5 block text-sm font-medium">
                Web Sitesi
              </label>
              <Input
                id="profile-website"
                name="websiteUrl"
                type="url"
                placeholder="https://..."
                defaultValue={initial.websiteUrl}
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              name="newsletterOptIn"
              defaultChecked={initial.newsletterOptIn}
              className="h-4 w-4 rounded border-border accent-brand-primary"
            />
            Bülten ve duyuru maillerini almak istiyorum
          </label>

          {initial.kvkkConsentMissing && (
            <label className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm">
              <input
                type="checkbox"
                name="kvkkConsent"
                className="mt-0.5 h-4 w-4 rounded border-border accent-brand-primary"
              />
              <span>
                <Link
                  href="/kvkk"
                  target="_blank"
                  className="font-medium text-brand-primary hover:underline"
                >
                  KVKK Aydınlatma Metni
                </Link>
                &apos;ni okudum; kişisel verilerimin işlenmesine onay veriyorum.
                (Tek tık etkinlik kaydı için gereklidir.)
              </span>
            </label>
          )}

          {status === "error" && (
            <p role="alert" className="text-sm text-brand-error">
              {errorMessage}
            </p>
          )}
          {status === "success" && (
            <p role="status" className="flex items-center gap-2 text-sm text-brand-success">
              <CheckCircle2 className="h-4 w-4" />
              Profilin güncellendi.
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Kaydediliyor..." : "Profili Kaydet"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/profil")}>
              Profilime Dön
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Download, LogOut, Pencil, UserRound } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { signOutUser } from "@/lib/auth/actions";
import { cancelOwnRegistration } from "@/lib/actions/profile";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Profilim",
    description: "NEXRISE üye profili: kayıtların ve sertifikaların.",
    path: "/profil",
  }),
  robots: { index: false, follow: false },
};

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
}

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/giris");

  const supabase = createServerClient();
  const profile = currentUser.profile;
  const email = currentUser.authUser.email ?? "";

  // Üyelik öncesi misafir kayıtları da e-posta eşleşmesiyle gösterilir
  const { data: registrations } = supabase
    ? await supabase
        .from("event_registrations")
        .select("id, event_id, webinar_id, status, attended, created_at")
        .or(`user_id.eq.${currentUser.authUser.id},email.eq.${email.toLowerCase()}`)
        .order("created_at", { ascending: false })
    : { data: null };

  const registrationRows = registrations ?? [];
  const eventIds = registrationRows
    .map((row) => row.event_id)
    .filter((value): value is string => Boolean(value));
  const webinarIds = registrationRows
    .map((row) => row.webinar_id)
    .filter((value): value is string => Boolean(value));
  const registrationIds = registrationRows.map((row) => row.id);

  const [{ data: events }, { data: webinars }, { data: certificates }] = supabase
    ? await Promise.all([
        eventIds.length > 0
          ? supabase.from("events").select("id, title, slug, event_date").in("id", eventIds)
          : Promise.resolve({
              data: [] as { id: string; title: string; slug: string; event_date: string | null }[],
            }),
        webinarIds.length > 0
          ? supabase
              .from("webinars")
              .select("id, title, slug, webinar_date")
              .in("id", webinarIds)
          : Promise.resolve({
              data: [] as { id: string; title: string; slug: string; webinar_date: string | null }[],
            }),
        registrationIds.length > 0
          ? supabase
              .from("certificates")
              .select("registration_id, code, event_title, issued_at")
              .in("registration_id", registrationIds)
          : Promise.resolve({
              data: [] as {
                registration_id: string;
                code: string;
                event_title: string;
                issued_at: string;
              }[],
            }),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const eventById = new Map((events ?? []).map((event) => [event.id, event]));
  const webinarById = new Map((webinars ?? []).map((webinar) => [webinar.id, webinar]));

  const interests = Array.isArray(profile?.interests)
    ? (profile?.interests as string[])
    : [];

  return (
    <section className="min-h-screen bg-muted/30 pb-20 pt-28">
      <Container className="max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Profil fotoğrafı"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <UserRound className="m-auto mt-4 h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.full_name ?? email}</h1>
              <p className="text-sm text-muted-foreground">
                {email}
                {profile?.username ? ` · @${profile.username}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/profil/duzenle">
                <Pencil className="mr-1.5 h-4 w-4" />
                Profili Düzenle
              </Link>
            </Button>
            <form action={signOutUser}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="mr-1.5 h-4 w-4" />
                Çıkış
              </Button>
            </form>
          </div>
        </div>

        {(profile?.bio || interests.length > 0) && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              {profile?.bio && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {profile.bio}
                </p>
              )}
              {interests.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Kayıtlarım ({registrationRows.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {registrationRows.length === 0 ? (
                <p className="text-muted-foreground">
                  Henüz etkinlik kaydın yok.{" "}
                  <Link href="/etkinlikler" className="text-brand-primary hover:underline">
                    Etkinliklere göz at →
                  </Link>
                </p>
              ) : (
                registrationRows.map((registration) => {
                  const target = registration.event_id
                    ? eventById.get(registration.event_id)
                    : webinarById.get(registration.webinar_id ?? "");
                  const detailHref = registration.event_id
                    ? `/etkinlikler/${target?.slug ?? ""}`
                    : `/webinarlar/${target?.slug ?? ""}`;
                  const isUpcomingRegistered =
                    registration.status === "registered" && registration.attended === null;
                  return (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0"
                    >
                      <div>
                        <Link href={detailHref} className="font-medium hover:underline">
                          {target?.title ?? "Etkinlik"}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          Kayıt: {formatDateTime(registration.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            registration.status === "cancelled" ||
                            registration.attended === false
                              ? "secondary"
                              : "default"
                          }
                        >
                          {registration.status === "cancelled"
                            ? "İptal"
                            : registration.attended === true
                              ? "Katıldı"
                              : registration.attended === false
                                ? "Katılmadı"
                                : "Kayıtlı"}
                        </Badge>
                        {isUpcomingRegistered && (
                          <ConfirmButton
                            message={`"${target?.title ?? "Etkinlik"}" kaydın iptal edilsin mi?`}
                            action={cancelOwnRegistration.bind(null, registration.id)}
                            variant="ghost"
                          >
                            İptal Et
                          </ConfirmButton>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Sertifikalarım ({certificates?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!certificates || certificates.length === 0 ? (
                <p className="text-muted-foreground">
                  Henüz sertifikan yok. Etkinliklere katıldıkça sertifikaların
                  burada birikecek.
                </p>
              ) : (
                certificates.map((certificate) => (
                  <div
                    key={certificate.code}
                    className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{certificate.event_title}</p>
                      <p className="text-xs text-muted-foreground">
                        {certificate.code} · {formatDateTime(certificate.issued_at)}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={`/api/certificates/${certificate.code}`} download>
                        <Download className="mr-1.5 h-4 w-4" />
                        İndir
                      </a>
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { adminRoleLabels } from "@/lib/admin/permissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

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

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!user) notFound();

  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("id, event_id, webinar_id, status, attended, created_at")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  const registrationRows = registrations ?? [];
  const eventIds = registrationRows
    .map((row) => row.event_id)
    .filter((value): value is string => Boolean(value));
  const webinarIds = registrationRows
    .map((row) => row.webinar_id)
    .filter((value): value is string => Boolean(value));
  const registrationIds = registrationRows.map((row) => row.id);

  const [{ data: events }, { data: webinars }, { data: certificates }] =
    await Promise.all([
      eventIds.length > 0
        ? supabase.from("events").select("id, title").in("id", eventIds)
        : Promise.resolve({ data: [] as { id: string; title: string }[] }),
      webinarIds.length > 0
        ? supabase.from("webinars").select("id, title").in("id", webinarIds)
        : Promise.resolve({ data: [] as { id: string; title: string }[] }),
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
    ]);

  const titleById = new Map([
    ...(events ?? []).map((event) => [event.id, event.title] as const),
    ...(webinars ?? []).map((webinar) => [webinar.id, webinar.title] as const),
  ]);

  const interests = Array.isArray(user.interests) ? (user.interests as string[]) : [];

  const profileFields: { label: string; value: string | null }[] = [
    { label: "E-posta", value: user.email },
    { label: "Kullanıcı adı", value: user.username ? `@${user.username}` : null },
    { label: "Şehir", value: user.city },
    { label: "Üniversite", value: user.university },
    { label: "Lise", value: user.high_school },
    { label: "Meslek", value: user.profession },
    { label: "LinkedIn", value: user.linkedin_url },
    { label: "GitHub", value: user.github_url },
    { label: "Instagram", value: user.instagram_url },
    { label: "Web sitesi", value: user.website_url },
    { label: "Kayıt tarihi", value: formatDateTime(user.created_at) },
    { label: "KVKK onayı", value: formatDateTime(user.kvkk_consent_at) },
  ];

  return (
    <div>
      <Button asChild variant="secondary" size="sm" className="mb-6">
        <Link href="/admin/users">
          <ArrowLeft className="h-4 w-4" /> Üye Listesi
        </Link>
      </Button>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{user.full_name ?? user.email}</h1>
        <Badge variant={user.is_active ? "default" : "secondary"}>
          {user.is_active ? "Aktif" : "Pasif"}
        </Badge>
        {user.admin_role && (
          <Badge variant="secondary">{adminRoleLabels[user.admin_role]}</Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profil Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {profileFields
              .filter((field) => field.value)
              .map((field) => (
                <p
                  key={field.label}
                  className="flex justify-between border-b border-border/50 pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{field.label}</span>
                  <span className="max-w-64 truncate font-medium">{field.value}</span>
                </p>
              ))}
            {user.bio && (
              <p className="pt-2 text-muted-foreground">{user.bio}</p>
            )}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {interests.map((interest) => (
                  <Badge key={interest} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Etkinlik Geçmişi ({registrationRows.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {registrationRows.length === 0 ? (
                <p className="text-muted-foreground">Henüz etkinlik kaydı yok.</p>
              ) : (
                registrationRows.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {titleById.get(
                          registration.event_id ?? registration.webinar_id ?? ""
                        ) ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(registration.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        registration.status === "cancelled" || registration.attended === false
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
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Sertifikalar ({certificates?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {!certificates || certificates.length === 0 ? (
                <p className="text-muted-foreground">Henüz sertifika yok.</p>
              ) : (
                certificates.map((certificate) => (
                  <div
                    key={certificate.code}
                    className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{certificate.event_title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(certificate.issued_at)}
                      </p>
                    </div>
                    <Link
                      href={`/sertifika-dogrula/${certificate.code}`}
                      className="text-xs text-brand-primary hover:underline"
                    >
                      {certificate.code}
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

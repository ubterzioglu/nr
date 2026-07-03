import { AuthSplitCard } from "@/components/shared/auth-split-card";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  const supabaseEnabled = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const legacyEnabled =
    Boolean(process.env.ADMIN_SECRET) && process.env.ADMIN_LEGACY_LOGIN !== "false";

  return (
    <AuthSplitCard
      badge="Yönetim Paneli"
      title="NEXRISE içerik yönetimi"
      description="Etkinlikler, webinarlar, duyurular ve diğer site içerikleri bu panel üzerinden yönetilir."
      features={[
        "Etkinlik ve webinar yönetimi",
        "Duyuru ve blog içerikleri",
        "Başvuru ve iletişim mesajları",
      ]}
    >
      <AdminLoginForm supabaseEnabled={supabaseEnabled} legacyEnabled={legacyEnabled} />
    </AuthSplitCard>
  );
}

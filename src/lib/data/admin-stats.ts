import { createServerClient } from "@/lib/supabase/client";

export interface AdminDashboardData {
  totalMembers: number;
  todayMembers: number;
  upcomingEvents: number;
  upcomingWebinars: number;
  pendingApplications: number;
  totalRegistrations: number;
  mail30d: { sent: number; failed: number };
  recentMembers: { id: string; fullName: string; email: string; createdAt: string }[];
  recentApplications: {
    id: string;
    fullName: string;
    type: string;
    status: string;
    createdAt: string;
  }[];
  recentMessages: {
    id: string;
    fullName: string;
    email: string;
    preview: string;
    isRead: boolean;
  }[];
}

/**
 * Admin dashboard canlı sayıları (content.pdf §3).
 * Supabase yapılandırılmamışsa null döner; dashboard config
 * fallback'ine düşer.
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData | null> {
  const supabase = createServerClient();
  if (!supabase) return null;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const today = new Date().toISOString().slice(0, 10);

  const [
    totalMembers,
    todayMembers,
    upcomingEvents,
    upcomingWebinars,
    pendingApplications,
    totalRegistrations,
    mailSent,
    mailFailed,
    recentMembers,
    recentApplications,
    recentMessages,
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString()),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .gte("event_date", today),
    supabase
      .from("webinars")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .gte("webinar_date", new Date().toISOString()),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("event_registrations")
      .select("id", { count: "exact", head: true })
      .eq("status", "registered"),
    supabase
      .from("email_log")
      .select("id", { count: "exact", head: true })
      .eq("status", "sent")
      .gte("created_at", monthAgo),
    supabase
      .from("email_log")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed")
      .gte("created_at", monthAgo),
    supabase
      .from("users")
      .select("id, full_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("applications")
      .select("id, full_name, type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("contacts")
      .select("id, full_name, email, message, is_read")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    totalMembers: totalMembers.count ?? 0,
    todayMembers: todayMembers.count ?? 0,
    upcomingEvents: upcomingEvents.count ?? 0,
    upcomingWebinars: upcomingWebinars.count ?? 0,
    pendingApplications: pendingApplications.count ?? 0,
    totalRegistrations: totalRegistrations.count ?? 0,
    mail30d: {
      sent: mailSent.count ?? 0,
      failed: mailFailed.count ?? 0,
    },
    recentMembers: (recentMembers.data ?? []).map((row) => ({
      id: row.id,
      fullName: row.full_name ?? row.email,
      email: row.email,
      createdAt: row.created_at,
    })),
    recentApplications: (recentApplications.data ?? []).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      type: row.type,
      status: row.status,
      createdAt: row.created_at,
    })),
    recentMessages: (recentMessages.data ?? []).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      preview: row.message.slice(0, 120),
      isRead: row.is_read,
    })),
  };
}

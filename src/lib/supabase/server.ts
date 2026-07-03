import { cookies } from "next/headers";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

export type CurrentUser = {
  authUser: User;
  profile: UserProfile | null;
};

/**
 * Cookie tabanlı, oturuma duyarlı Supabase istemcisi (anon key + RLS).
 * Server Component ve Server Action'larda kullanılır; kimliği doğrulanmış
 * kullanıcının kendi verisini okumak içindir. Yazma işlemleri mevcut desen
 * gereği createServerClient() (service role, src/lib/supabase/client.ts)
 * üzerinden yapılmaya devam eder.
 *
 * Supabase yapılandırılmamışsa null döner — site DB'siz çalışmayı sürdürür.
 */
export async function createAuthServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createSSRClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component içinden cookie yazılamaz; oturum tazeleme
          // src/proxy.ts'te yapıldığı için bu durum güvenle yok sayılır.
        }
      },
    },
  });
}

/**
 * Geçerli oturumun kullanıcısı + public.users profil satırı.
 * Oturum yoksa veya Supabase yapılandırılmamışsa null döner.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createAuthServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // "users_select_own" RLS politikası kullanıcının kendi satırını açar.
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { authUser: user, profile: profile ?? null };
}

"use client";

import { createBrowserClient as createSSRBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Tarayıcı tarafı, cookie tabanlı Supabase istemcisi (@supabase/ssr).
 * Navbar gibi statik sayfalarda oturum durumunu okumak için kullanılır;
 * Supabase yapılandırılmamışsa null döner.
 */
export function createAuthBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createSSRBrowserClient<Database>(url, anonKey);
}

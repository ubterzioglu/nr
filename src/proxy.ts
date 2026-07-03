import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase oturum çerezlerini her istekte tazeler (@supabase/ssr deseni).
 * Next.js 16'da middleware.ts yerine proxy.ts kullanılır.
 * Supabase yapılandırılmamışsa istek olduğu gibi geçer.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() süresi dolan access token'ı yeniler; dönüş değeri kullanılmaz.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Statik dosyalar, imaj optimizasyonu ve favicon hariç tüm istekler
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

import { requireEnv } from "@/utils/env";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";
import { ENVIRONMENT } from "@/config/env";

export async function supabaseProxy(request: NextRequest) {
  requireEnv("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(ENVIRONMENT.SUPABASE_URL!, ENVIRONMENT.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // Jika user belum login & akses halaman terproteksi atau root
  if (!user && (url.pathname === "/" || url.pathname.startsWith("/dashboard"))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Jika user SUDAH login & akses / atau /login
  if (user && (url.pathname === "/" || url.pathname === "/login")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

import { cookies } from "next/headers";
import { requireEnv } from "@/utils/env";
import { createServerClient } from "@supabase/ssr";
import { ENVIRONMENT } from "@/config/env";

export async function createClient() {
  requireEnv("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  const cookieStore = await cookies();

  return createServerClient(ENVIRONMENT.SUPABASE_URL!, ENVIRONMENT.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {}
      },
    },
  });
}

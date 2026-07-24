import { requireEnv } from "@/utils/env";
import { createBrowserClient } from "@supabase/ssr";
import { ENVIRONMENT } from "@/config/env";

export function createClient() {
  requireEnv("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return createBrowserClient(ENVIRONMENT.SUPABASE_URL!, ENVIRONMENT.SUPABASE_PUBLISHABLE_KEY!);
}

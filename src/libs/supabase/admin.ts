import { requireEnv } from "@/utils/env";
import { createClient } from "@supabase/supabase-js";
import { ENVIRONMENT } from "@/config/env";

export function createAdminClient() {
  requireEnv("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SECRET_KEY");

  return createClient(ENVIRONMENT.SUPABASE_URL!, ENVIRONMENT.SUPABASE_SECRET_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

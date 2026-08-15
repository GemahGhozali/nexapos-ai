"use server";

import { createClient } from "@/libs/supabase/server";

export async function getCurrentUserAndActiveShift() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { user: null, shift: null };

    const [profileResponse, shiftResponse] = await Promise.all([
      supabase.from("profiles").select("id, email, fullname, role, profileImage: profile_image").eq("id", user.id).single(),
      supabase
        .from("shifts")
        .select("id, openingCash: opening_cash, status, openedAt: opened_at")
        .eq("user_id", user.id)
        .eq("status", "open")
        .maybeSingle(),
    ]);

    if (profileResponse.error) {
      console.log("❌ Get User Profile Error :", profileResponse.error);
      return { user: null, shift: null };
    }

    if (shiftResponse.error) {
      console.log("❌ Get Active Shift Error :", shiftResponse.error);
      return { user: profileResponse.data, shift: null };
    }

    return { user: profileResponse.data, shift: shiftResponse.data };
  } catch (error) {
    console.log("❌ Get User and Active Shift Error :", error);
    return { user: null, shift: null };
  }
}

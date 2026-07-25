"use server";

import { createClient } from "@/libs/supabase/server";

export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return null;

    const { data: profile, error: dbError } = await supabase.from("profiles").select("fullname, role, profile_image").eq("id", user.id).single();

    if (dbError || !profile) return null;

    return {
      id: user.id,
      email: user.email,
      fullname: profile.fullname,
      role: profile.role,
      profileImage: profile.profile_image,
    };
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}

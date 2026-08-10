"use server";

import { createClient } from "@/libs/supabase/server";

export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error: getProfileError } = await supabase
      .from("profiles")
      .select("fullname, role, profile_image")
      .eq("id", user.id)
      .single();

    if (getProfileError) {
      console.log("❌ Get Current User Profile Error :", getProfileError);
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      fullname: profile.fullname,
      role: profile.role,
      profileImage: profile.profile_image,
    };
  } catch (error) {
    console.log("❌ Get Current User Profile Error :", error);
    return null;
  }
}

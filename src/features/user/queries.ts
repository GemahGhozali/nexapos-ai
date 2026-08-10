"use server";

import { ENVIRONMENT } from "@/config/env";
import { createClient } from "@/libs/supabase/server";

export async function getAllUsers() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, fullname, role, profile_image")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Get All Users Error : ", error);
      return { data: null, error: "Gagal mendapatkan data pengguna!" };
    }

    return {
      error: null,
      data: data.map(({ profile_image, ...user }) => {
        const profileImage = profile_image ? `${ENVIRONMENT.SUPABASE_STORAGE_URL}/images/${profile_image}` : null;
        return { ...user, profileImage };
      }),
    };
  } catch (error) {
    console.error("❌ Get All Users Error : ", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

export async function getUserById(userId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("profiles").select("id, email, fullname, role, profile_image").eq("id", userId).single();

    if (error) {
      console.error("❌ Get User By ID Error : ", error);
      return { data: null, error: "Data pengguna tidak ditemukan!" };
    }

    const { profile_image, ...userData } = data;
    const profileImage = profile_image ? `${ENVIRONMENT.SUPABASE_STORAGE_URL}/images/${profile_image}` : null;

    return { data: { ...userData, profileImage }, error: null };
  } catch (error) {
    console.error("❌ Get User By ID Error : ", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

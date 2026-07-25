"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/libs/supabase/server";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { LoginSchema, LoginInput } from "./schemas";

export async function login(data: LoginInput): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const validated = LoginSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid!",
        errors: formatZodError(validated.error),
      };
    }

    const { email, password } = validated.data;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { success: false, message: "Email atau password salah!" };

    revalidatePath("/", "layout");
    return { success: true, message: "Login berhasil!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function logout(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    await supabase.auth.signOut();

    revalidatePath("/", "layout");
    return { success: true, message: "Logout berhasil!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

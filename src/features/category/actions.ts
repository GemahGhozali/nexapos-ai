"use server";

import { createClient } from "@/libs/supabase/server";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { CategorySchema, CategoryInput } from "./schemas";

export async function createCategory(data: CategoryInput): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const validated = CategorySchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Data kategori tidak valid!",
        errors: formatZodError(validated.error),
      };
    }

    const { error } = await supabase.from("categories").insert(validated.data);

    if (error && error.code === "23505") {
      return {
        success: false,
        message: "Gagal menambahkan data kategori!",
        errors: {
          name: "Nama kategori sudah ada! Gunakan nama lain.",
        },
      };
    }

    if (error) {
      console.log("❌ Create Category Error :", error);
      return { success: false, message: "Gagal menambahkan data kategori!" };
    }

    return { success: true, message: "Data kategori berhasil dibuat!" };
  } catch (error) {
    console.log("❌ Create Category Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateCategory(categoryId: string, data: CategoryInput): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const validated = CategorySchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid!",
        errors: formatZodError(validated.error),
      };
    }

    const { error } = await supabase.from("categories").update(validated.data).eq("id", categoryId);

    if (error && error.code === "23505") {
      return {
        success: false,
        message: "Gagal memperbarui data kategori!",
        errors: {
          name: "Nama kategori sudah ada! Gunakan nama lain.",
        },
      };
    }

    if (error) {
      console.log("❌ Update Category Error :", error);
      return { success: false, message: "Gagal memperbarui data kategori!" };
    }

    return { success: true, message: "Data kategori berhasil diperbarui!" };
  } catch (error) {
    console.log("❌ Update Category Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function deleteCategory(categoryId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("categories").delete().eq("id", categoryId);

    if (error) {
      console.log("❌ Delete Category Error :", error);
      return { success: false, message: "Gagal menghapus data kategori!" };
    }

    return { success: true, message: "Data kategori berhasil dihapus!" };
  } catch (error) {
    console.log("❌ Delete Category Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

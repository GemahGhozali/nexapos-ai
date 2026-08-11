"use server";

import { createClient } from "@/libs/supabase/server";

export async function getAllCategories() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("categories").select("id, name, description, products(count)");

    if (error) {
      console.log("❌ Get All Categories Error : ", error);
      return { data: null, error: "Gagal mendapatkan data kategori!" };
    }

    return {
      error: null,
      data: data.map(({ products, ...category }) => {
        const totalProduct = products[0].count;
        return { ...category, totalProduct };
      }),
    };
  } catch (error) {
    console.log("❌ Get All Categories Error : ", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

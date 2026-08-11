"use server";

import { ENVIRONMENT } from "@/config/env";
import { createClient } from "@/libs/supabase/server";

export async function getAllProducts() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("products").select("id, name, price, hpp, image, category: categories(id, name)");

    if (error) {
      console.log("❌ Get All Products Error : ", error);
      return { data: null, error: "Gagal mendapatkan data produk!" };
    }

    return {
      error: null,
      data: data.map((product) => {
        const category = Array.isArray(product.category) ? product.category[0] : product.category;
        const image = product.image ? `${ENVIRONMENT.SUPABASE_STORAGE_URL}/images/${product.image}` : null;
        return { ...product, category, image };
      }),
    };
  } catch (error) {
    console.log("❌ Get All Products Error : ", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

export async function getProductById(productId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, hpp, image, category: categories(id, name)")
      .eq("id", productId)
      .single();

    if (error) {
      console.log("❌ Get Product By Id Error : ", error);
      return { data: null, error: "Data produk tidak ditemukan!" };
    }

    const category = Array.isArray(data.category) ? data.category[0] : data.category;
    const image = data.image ? `${ENVIRONMENT.SUPABASE_STORAGE_URL}/images/${data.image}` : null;

    return { error: null, data: { ...data, category, image } };
  } catch (error) {
    console.log("❌ Get Product By Id Error : ", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

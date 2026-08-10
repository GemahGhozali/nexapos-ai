"use server";

import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { createAdminClient } from "@/libs/supabase/admin";
import { deleteFilesFromStorage } from "@/utils/supabase-storage";
import { ProductSchema, ProductInput } from "./schemas";
import { handleProductImageUpdate, uploadProductImage } from "./utils";

export async function createProduct(data: ProductInput): Promise<ActionResponse> {
  try {
    const supabase = await createAdminClient();

    const validated = ProductSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Data produk tidak valid!",
        errors: formatZodError(validated.error),
      };
    }

    const { image, categoryId, ...newProductData } = validated.data;

    let menuImageUrl: string | null = null;

    if (image instanceof File) {
      const imageUrl = await uploadProductImage({ supabase, file: image });

      if (!imageUrl) return { success: false, message: "Gagal mengupload gambar produk!" };

      menuImageUrl = imageUrl;
    }

    const { error } = await supabase.from("products").insert({ ...newProductData, category_id: categoryId || null, image: menuImageUrl });

    if (error && error.code === "23505") {
      return {
        success: false,
        message: "Gagal membuat data produk!",
        errors: {
          name: "Nama produk sudah digunakan! Silahkan gunakan nama lain.",
        },
      };
    }

    if (error) {
      console.log("❌ Create Product Error :", error);
      return { success: false, message: "Gagal membuat data produk!" };
    }

    return { success: true, message: "Data produk berhasil dibuat!" };
  } catch (error) {
    console.log("❌ Create Product Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateProduct(productId: string, data: ProductInput): Promise<ActionResponse> {
  try {
    const supabase = await createAdminClient();

    const validated = ProductSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Data produk tidak valid!",
        errors: formatZodError(validated.error),
      };
    }

    const { image, categoryId, ...newProductData } = validated.data;

    const { data: currentProduct, error: getCurrentProductError } = await supabase
      .from("products")
      .select("id, name, price, hpp, image, category_id")
      .eq("id", productId)
      .single();

    if (getCurrentProductError) {
      console.log("❌ Update User Error:", getCurrentProductError);
      return { success: false, message: "Data produk tidak ditemukan!" };
    }

    const updateProductImageResult = await handleProductImageUpdate({ supabase, currentImageUrl: currentProduct.image, productImage: image });

    if (!updateProductImageResult.success) return { success: false, message: updateProductImageResult.message };

    const productImageURL = updateProductImageResult.imageURL;

    const { error: updateProductError } = await supabase
      .from("products")
      .update({ ...newProductData, category_id: categoryId || null, image: productImageURL })
      .eq("id", productId);

    if (updateProductError && updateProductError.code === "23505") {
      return {
        success: false,
        message: "Gagal memperbarui data produk!",
        errors: {
          name: "Nama produk sudah digunakan! Silahkan gunakan nama lain.",
        },
      };
    }

    if (updateProductError) {
      console.log("❌ Update Product Error :", updateProductError);
      return { success: false, message: "Gagal memperbarui data produk!" };
    }

    return { success: true, message: "Data produk berhasil diperbarui!" };
  } catch (error) {
    console.log("❌ Update Product Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResponse> {
  try {
    const supabase = await createAdminClient();

    const { data: product, error: getProductError } = await supabase.from("products").select("image").eq("id", productId).single();

    if (getProductError) {
      console.log("❌ Delete Product Error :", getProductError);
      return { success: false, message: "Data produk tidak ditemukan!" };
    }

    if (product.image) {
      const imageDeleted = await deleteFilesFromStorage({ supabase, bucket: "images", filePaths: [product.image] });

      if (!imageDeleted) return { success: false, message: "Gagal menghapus gambar produk!" };
    }

    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      console.log("❌ Delete Product Error :", error);
      return { success: false, message: "Gagal menghapus data produk!" };
    }

    return { success: true, message: "Data produk berhasil dihapus!" };
  } catch (error) {
    console.log("❌ Delete Product Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

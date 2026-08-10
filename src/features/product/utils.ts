import { SupabaseClient } from "@supabase/supabase-js";
import { deleteFilesFromStorage, uploadFileToStorage } from "@/utils/supabase-storage";

interface UploadProductImageParams {
  supabase: SupabaseClient;
  file: File;
}

interface HandleProfileImageParams {
  supabase: SupabaseClient;
  productImage?: File | string | null;
  currentImageUrl?: string | null;
}

export async function uploadProductImage({ supabase, file }: UploadProductImageParams) {
  const fileExt = file.name.split(".").pop();
  const filePath = `products/${Date.now()}.${fileExt}`;
  return await uploadFileToStorage({ supabase, bucket: "images", filePath, file });
}

export async function handleProductImageUpdate({ supabase, productImage, currentImageUrl = null }: HandleProfileImageParams) {
  let imageURL: string | null = currentImageUrl;

  const isUploadingNewImage = productImage instanceof File;
  const isClearingImage = productImage === null;
  const hasExistingImage = Boolean(currentImageUrl);

  const shouldDeleteOldImage = hasExistingImage && (isUploadingNewImage || isClearingImage);

  if (shouldDeleteOldImage && currentImageUrl) {
    const imageDeleted = await deleteFilesFromStorage({ supabase, bucket: "images", filePaths: [currentImageUrl] });

    if (!imageDeleted) return { success: false, imageURL: currentImageUrl, message: "Gagal menghapus gambar lama produk!" };

    imageURL = null;
  }

  if (isUploadingNewImage) {
    const imageUrl = await uploadProductImage({ supabase, file: productImage });

    if (!imageUrl) return { success: false, imageURL: null, message: "Gagal mengupload gambar baru produk!" };

    imageURL = imageUrl;
  }

  return { success: true, imageURL, message: "Gambar produk berhasil diperbarui!" };
}

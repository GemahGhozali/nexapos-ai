import { SupabaseClient } from "@supabase/supabase-js";
import { deleteFilesFromStorage, uploadFileToStorage } from "@/utils/supabase-storage";

interface UploadProfileImageParams {
  supabase: SupabaseClient;
  userId: string;
  file: File;
}

interface HandleUpdateAccountParams {
  supabase: SupabaseClient;
  userId: string;
  data: {
    currentEmail: string;
    newEmail: string;
    newPassword: string | undefined;
  };
}

interface HandleProfileImageParams {
  supabase: SupabaseClient;
  userId: string;
  profileImage?: File | string | null;
  currentImageUrl?: string | null;
}

export async function uploadProfileImage({ supabase, userId, file }: UploadProfileImageParams) {
  const fileExt = file.name.split(".").pop();
  const filePath = `users/${userId}-${Date.now()}.${fileExt}`;
  return await uploadFileToStorage({ supabase, bucket: "images", filePath, file });
}

export async function handleUpdateAccount({ supabase, userId, data }: HandleUpdateAccountParams) {
  const { currentEmail, newEmail, newPassword } = data;

  const emailChanged = currentEmail !== newEmail;
  const hasNewPassword = Boolean(newPassword);

  const accountUpdatePayload: { email?: string; password?: string } = {};

  if (emailChanged) {
    accountUpdatePayload.email = newEmail;
  }

  if (hasNewPassword) {
    accountUpdatePayload.password = newPassword;
  }

  const shouldUpdateAccount = Object.keys(accountUpdatePayload).length > 0;

  if (!shouldUpdateAccount) return { success: true, message: "Data pengguna tidak perlu diperbarui." };

  const { error: updateAccountError } = await supabase.auth.admin.updateUserById(userId, accountUpdatePayload);

  if (updateAccountError) {
    console.error("❌ Update User Error:", updateAccountError);
    return { success: false, message: "Gagal memperbarui data pengguna!" };
  }

  return { success: true, message: "Data pengguna berhasil diperbarui!" };
}

export async function handleProfileImageUpdate({ supabase, userId, profileImage, currentImageUrl = null }: HandleProfileImageParams) {
  let avatarUrl: string | null = currentImageUrl;

  const isUploadingNewImage = profileImage instanceof File;
  const isClearingImage = profileImage === null;
  const hasExistingImage = Boolean(currentImageUrl);

  const shouldDeleteOldImage = hasExistingImage && (isUploadingNewImage || isClearingImage);

  if (shouldDeleteOldImage && currentImageUrl) {
    const imageDeleted = await deleteFilesFromStorage({ supabase, bucket: "images", filePaths: [currentImageUrl] });

    if (!imageDeleted) return { success: false, avatarUrl: currentImageUrl, message: "Gagal menghapus profil lama pengguna!" };

    avatarUrl = null;
  }

  if (isUploadingNewImage) {
    const imageUrl = await uploadProfileImage({ supabase, userId, file: profileImage });

    if (!imageUrl) return { success: false, avatarUrl: null, message: "Gagal mengupload profil baru pengguna!" };

    avatarUrl = imageUrl;
  }

  return { success: true, avatarUrl, message: "Profil pengguna berhasil diperbarui!" };
}

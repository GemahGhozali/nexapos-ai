"use server";

import { formatZodError } from "@/utils/format-zod-error";
import { createAdminClient } from "@/libs/supabase/admin";
import { deleteFilesFromStorage } from "@/utils/supabase-storage";
import { CreateUserSchema, CreateUserInput, UpdateUserSchema, UpdateUserInput } from "./schemas";
import { handleProfileImageUpdate, handleUpdateAccount, uploadProfileImage } from "./utils";

export async function createUser(data: CreateUserInput) {
  try {
    const supabase = createAdminClient();

    const validated = CreateUserSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid user data!",
        errors: formatZodError(validated.error),
      };
    }

    const { email, password, fullname, role, profileImage } = validated.data;

    // Buat akun baru (email dan password)
    const { data: account, error: createAccountError } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });

    // Validasi duplikasi alamat email
    if (createAccountError && createAccountError.status === 422) {
      return {
        success: false,
        message: "Failed to create user data!",
        errors: {
          email: "Email already in used! Please try different email.",
        },
      };
    }

    if (createAccountError) {
      console.error("❌ Create User Error :", createAccountError);
      return { success: false, message: "Failed to create user data!" };
    }

    const userId = account.user.id;

    // Upload profile image ke storage (jika file ada dikirim)
    let profileImageUrl: string | null = null;

    if (profileImage instanceof File) {
      const imageUrl = await uploadProfileImage({ supabase, userId, file: profileImage });

      if (!imageUrl) return { success: false, message: "Failed to upload user profile image!" };

      profileImageUrl = imageUrl;
    }

    // Buat data profil untuk akun
    const { error: createProfileError } = await supabase
      .from("profiles")
      .insert({ id: userId, email, fullname, role, profile_image: profileImageUrl });

    if (createProfileError) {
      console.error("❌ Create User Error :", createProfileError);
      await supabase.auth.admin.deleteUser(userId);
      return { success: false, message: "Failed to create user data!" };
    }

    return { success: true, message: "User data successfully created!" };
  } catch (error) {
    console.error("❌ Create User Error :", error);
    return { success: false, message: "Internal server error!" };
  }
}

export async function updateUser(userId: string, data: UpdateUserInput) {
  try {
    const supabase = createAdminClient();

    const validated = UpdateUserSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid user data!",
        errors: formatZodError(validated.error),
      };
    }

    const { email, password, fullname, role, profileImage } = validated.data;

    // Validasi apakah user ditemukan berdasarkan id yang dikirimkan
    const { data: currentUser, error: getCurrentUserError } = await supabase
      .from("profiles")
      .select("email, profile_image")
      .eq("id", userId)
      .single();

    if (getCurrentUserError) {
      console.error("❌ Update User Error:", getCurrentUserError);
      return { success: false, message: "User not found!" };
    }

    // Update data akun email dan password (jika terdapat perubahan)
    const updateAccountResult = await handleUpdateAccount({
      supabase,
      userId,
      data: {
        currentEmail: currentUser.email,
        newEmail: email,
        newPassword: password,
      },
    });

    if (!updateAccountResult.success) return { success: false, message: updateAccountResult.message };

    // Update file profil gambar (jika terdapat perubahan)
    const imageResult = await handleProfileImageUpdate({ supabase, userId, profileImage, currentImageUrl: currentUser.profile_image });

    if (!imageResult.success) return { success: false, message: imageResult.message };

    const profileImageUrl = imageResult.avatarUrl;

    // Update data profil akun
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        email,
        fullname,
        role,
        profile_image: profileImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateProfileError) {
      console.error("❌ Update User Error :", updateProfileError);
      return { success: false, message: "Failed to update user data!" };
    }

    return { success: true, message: "User data successfully updated!" };
  } catch (error) {
    console.error("❌ Update User Error :", error);
    return { success: false, message: "Internal server error!" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = createAdminClient();

    const { data: user } = await supabase.from("profiles").select("profile_image").eq("id", userId).single();

    if (!user) return { success: false, message: "User not found!" };

    // Jika user memiliki profil gambar sebelumnya, maka hapus filenya
    if (user.profile_image) {
      const imageDeleted = await deleteFilesFromStorage({ supabase, bucket: "images", filePaths: [user.profile_image] });

      if (!imageDeleted) return { success: false, message: "Failed to delete user profile image!" };
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("❌ Delete User Error:", error);
      return { success: false, message: "Failed to delete user data!" };
    }

    return { success: true, message: "User data successfully deleted!" };
  } catch (error) {
    console.error("❌ Delete User Error:", error);
    return { success: false, message: "Internal server error!" };
  }
}

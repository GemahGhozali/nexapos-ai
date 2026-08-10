import * as z from "zod";

const ProfileImageSchema = z
  .file()
  .max(1024 * 1024, "Maksimal ukuran gambar profil adalah 1 MB!")
  .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"], "Profil gambar hanya menerima format JPG, JPEG, PNG atau WEBP!");

const UserSchema = z.object({
  email: z.email("Format email tidak valid!"),
  fullname: z.string().min(2, "Nama harus memiliki minimal 2 karakter!"),
  role: z.enum(["admin", "cashier"], "Role harus antara 'Admin' atau 'Cashier!'"),
  profileImage: z.union([ProfileImageSchema, z.string(), z.null()]),
});

export const CreateUserSchema = UserSchema.extend({
  password: z.string().min(8, "Password harus memiliki minimal 8 karakter!"),
});

export const UpdateUserSchema = UserSchema.extend({
  password: z.string().min(8, "Password harus memiliki minimal 8 karakter!").optional().or(z.literal("")),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

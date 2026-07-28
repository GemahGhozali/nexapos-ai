import * as z from "zod";

const ProfileImageSchema = z
  .file()
  .max(1024 * 1024, "Maximal profile image size is 1 MB!")
  .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"], "Profile image only accept JPG, JPEG, PNG OR WEBP format!");

const UserSchema = z.object({
  email: z.email("Invalid email format!"),
  fullname: z.string().min(2, "Fullname must have at least 2 characters!"),
  role: z.enum(["admin", "cashier"], "Role must be between 'Admin' or 'Cashier!'"),
  profileImage: z.union([ProfileImageSchema, z.string(), z.null()]),
});

export const CreateUserSchema = UserSchema.extend({
  password: z.string().min(8, "Password must have at least 8 characters!"),
});

export const UpdateUserSchema = UserSchema.extend({
  password: z.string().min(8, "Password must have at least 8 characters!").optional().or(z.literal("")),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

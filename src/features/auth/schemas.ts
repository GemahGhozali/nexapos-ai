import * as z from "zod";

export const LoginSchema = z.object({
  email: z.email("Format email tidak valid!"),
  password: z.string().min(1, "Password wajib diisi!"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

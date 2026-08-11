import * as z from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi!"),
  description: z.string(),
});

export type CategoryInput = z.infer<typeof CategorySchema>;

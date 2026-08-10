import * as z from "zod";

const ProductImageSchema = z
  .file()
  .max(1024 * 1024, "Maksimal ukuran gambar produk adalah 1 MB!")
  .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"], "Gambar produk hanya menerima format JPG, JPEG, PNG atau WEBP!");

export const ProductSchema = z
  .object({
    name: z.string().min(1, "Nama produk wajib diisi!"),
    hpp: z.coerce.number<number>("HPP wajib diisi!").positive("HPP wajib diisi dan tidak boleh 0!"),
    price: z.coerce.number<number>("Harga wajib diisi!").positive("Harga wajib diisi dan tidak boleh 0!"),
    image: z.union([ProductImageSchema, z.string(), z.null()]),
    categoryId: z.string().nullable().optional(),
  })
  .refine((data) => data.price >= data.hpp, { message: "Harga tidak boleh lebih kecil dari HPP!", path: ["price"] });

export type ProductInput = z.infer<typeof ProductSchema>;

import * as z from "zod";

export const EXPENSE_CATEGORIES = [
  "Biaya Produksi",
  "Biaya Operasional",
  "Biaya Bahan Baku",
  "Biaya Pemasaran",
  "Biaya Pemeliharaan",
  "Biaya Tenaga Kerja",
  "Lainnya",
];

export const ExpenseSchema = z.object({
  amount: z.coerce.number<number>("Total nominal wajib diisi!").positive("Total nominal tidak boleh 0!"),
  category: z.enum(EXPENSE_CATEGORIES, "Kategori wajib diisi!"),
  paymentMethod: z.enum(["cash", "transfer"], "Metode pembayaran harus 'tunai' atau 'transfer'!"),
  description: z.string().min(1, "Keterangan wajib diisi!"),
});

export type ExpenseInput = z.infer<typeof ExpenseSchema>;

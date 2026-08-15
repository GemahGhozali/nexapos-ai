import * as z from "zod";

export const CashflowSchema = z.object({
  date: z.date("Tanggal wajib diisi!"),
  amount: z.coerce.number<number>("Total nominal wajib diisi!").positive("Total nominal tidak boleh 0!"),
  category: z.string().min(1, "Kategori wajib diisi!"),
  type: z.enum(["income", "expense"], "Tipe harus 'pemasukan' atau 'pengeluaran'!"),
  paymentMethod: z.enum(["cash", "transfer"], "Metode pembayaran harus 'tunai' atau 'transfer'!"),
  description: z.string(),
});

export type CashflowInput = z.infer<typeof CashflowSchema>;

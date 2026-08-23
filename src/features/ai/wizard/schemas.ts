import * as z from "zod";

export const WizardSchema = z.object({
  prompt: z.string().min(1),
});

export const CartItemSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      image: z.string().nullable(),
      quantity: z.number(),
    }),
  ),
});

export const ExpenseSchema = z.object({
  amount: z.number().default(0),
  category: z.enum([
    "Biaya Produksi",
    "Biaya Operasional",
    "Biaya Bahan Baku",
    "Biaya Pemasaran",
    "Biaya Pemeliharaan",
    "Biaya Tenaga Kerja",
    "Lainnya",
  ]),
  paymentMethod: z.enum(["cash", "transfer"]).default("cash"),
  description: z.string().describe("Capitalize short expense description"),
});

export type WizardInput = z.infer<typeof WizardSchema>;

import * as z from "zod";

export const CartItemSchema = z.object({
  productId: z.uuid("ID Produk tidak valid!"),
  quantity: z.number().int("Jumlah produk harus bilangan bulat!").positive("Jumlah produk tidak boleh 0!"),
});

export const CheckoutTransactionSchema = z
  .object({
    paymentMethod: z.enum(["cash", "transfer"], "Metode pembayaran harus 'tunai' atau 'transfer'!"),
    totalAmount: z.number(),
    paidAmount: z.coerce
      .number<number>("Nominal bayar harus berupa angka!")
      .int("Nominal bayar harus bilangan bulat!")
      .min(0, "Nominal bayar tidak boleh negatif!"),
    items: z.array(CartItemSchema).min(1, "Keranjang belanja tidak boleh kosong!"),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "cash") {
        return data.paidAmount >= data.totalAmount;
      }
      return true;
    },
    { message: "Uang pembayaran tidak mencukupi total pembayaran!", path: ["paidAmount"] },
  );

export type CartItemInput = z.infer<typeof CartItemSchema>;
export type CheckoutTransactionInput = z.infer<typeof CheckoutTransactionSchema>;

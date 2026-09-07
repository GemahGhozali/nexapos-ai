"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { formatZodError } from "@/utils/format-zod-error";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentUserAndActiveShift } from "../shift/queries";
import { CheckoutTransactionSchema, CheckoutTransactionInput } from "./schemas";
import { generateTransactionDetails, getProductInDatabaseByCartItems, validateCartItems } from "./utils";
import { createSnapTransaction } from "@/libs/midtrans";

export async function createTransaction(data: CheckoutTransactionInput) {
  try {
    const supabase = await createClient();

    // Step 1 : Validasi schema data
    const validated = CheckoutTransactionSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Data transaksi tidak valid!",
        errors: formatZodError(validated.error),
      };
    }

    const { items, paymentMethod, paidAmount } = validated.data;

    // Step 2 : Validasi autentikasi user dan keaktifan shift
    const { user, shift } = await getCurrentUserAndActiveShift();

    if (!user) redirect("/");

    if (!shift) return { success: false, message: "Transaksi gagal! Silahkan buka shift terlebih dahulu." };

    // Step 3 : Validasi data produk didalam cart dengan lookup ke database
    const { data: productInDatabase, error: getProductInDatabaseError } = await getProductInDatabaseByCartItems({ supabase, items });

    if (getProductInDatabaseError || !productInDatabase) {
      return { success: false, message: getProductInDatabaseError };
    }

    const productMap = new Map(productInDatabase.map((product) => [product.id, product]));

    const { error: cartItemValidationError } = validateCartItems({ productMap, items });

    if (cartItemValidationError) {
      return { success: false, message: cartItemValidationError };
    }

    // Step 4 : Buat transaction details
    const transactionDetails = generateTransactionDetails({ productMap, items });

    // Step 5 : Kalkulasi totalAmount, validasi paidAmount berdasarkan paymentMethod dan kalkulasi totalChange
    const totalAmount = transactionDetails.reduce((total, item) => total + item.subtotal, 0);

    const finalPaidAmount = paidAmount;

    if (paymentMethod === "cash" && finalPaidAmount < totalAmount) {
      return {
        success: false,
        message: "Transaksi gagal! ",
        errors: { paidAmount: "Nominal pembayaran tunai kurang dari total belanja!" },
      };
    }

    if (paymentMethod === "transfer") {
      const orderId = `ORDER-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

      const { error: createPaymentError } = await supabase.from("midtrans_payments").insert({
        order_id: orderId,
        user_id: user.id,
        shift_id: shift.id,
        total_amount: totalAmount,
        cart_items: transactionDetails,
      });

      if (createPaymentError) {
        console.log("❌ Create Midtrans Payment Error | Insert Payment :", createPaymentError);
        return { success: false, message: "Gagal menyiapkan pembayaran Midtrans! Silahkan coba lagi." };
      }

      try {
        const snapPayment = await createSnapTransaction({
          transaction_details: {
            order_id: orderId,
            gross_amount: totalAmount,
          },
          item_details: transactionDetails.map((item) => ({
            id: item.productId,
            price: item.priceAtSale,
            quantity: item.quantity,
            name: item.productName,
          })),
          callbacks: {
            finish: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/cashier`,
            unfinish: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/cashier`,
            error: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/cashier`,
          },
        });

        const { error: updatePaymentError } = await supabase
          .from("midtrans_payments")
          .update({
            snap_token: snapPayment.token,
            snap_redirect_url: snapPayment.redirect_url,
          })
          .eq("order_id", orderId)
          .eq("user_id", user.id);

        if (updatePaymentError) {
          console.log("❌ Create Midtrans Payment Error | Update Snap Data :", updatePaymentError);
          return { success: false, message: "Gagal menyimpan detail pembayaran Midtrans! Silahkan coba lagi." };
        }

        return {
          success: true,
          message: "Pembayaran Midtrans siap diproses.",
          data: {
            orderId,
            token: snapPayment.token,
            redirectUrl: snapPayment.redirect_url,
          },
        };
      } catch (error) {
        console.log("❌ Create Midtrans Payment Error | Snap :", error);
        return { success: false, message: "Gagal membuat pembayaran Midtrans! Silahkan coba lagi." };
      }
    }

    const totalChange = finalPaidAmount - totalAmount;

    // Step 5 : Buat data transaksi
    const { error: createTransactionError } = await supabase.rpc("create_transaction", {
      shiftId: shift.id,
      userId: user.id,
      paymentMethod,
      totalAmount,
      paidAmount: finalPaidAmount,
      totalChange,
      items: transactionDetails,
    });

    if (createTransactionError) {
      console.log("❌ Create Transaction Error | RPC Execution :", createTransactionError);
      return { success: false, message: "Gagal menyimpan transaksi ke database! Silahkan coba lagi." };
    }

    return { success: true, message: "Transaksi berhasil!" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Create Transaction Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

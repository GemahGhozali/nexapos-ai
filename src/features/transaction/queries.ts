"use server";

import { redirect } from "next/navigation";
import { ENVIRONMENT } from "@/config/env";
import { createClient } from "@/libs/supabase/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentUserAndActiveShift } from "../shift/queries";

export async function getAllTransactions() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        id,
        date,
        user: profiles(fullname),
        totalAmount: total_amount,
        paymentMethod: payment_method,
        paidAmount: paid_amount,
        changeAmount: change_amount,
        items: transaction_items (id, productName: product_name, image: products(image), priceAtSale: price_at_sale, quantity, subtotal)
      `,
      )
      .order("date", { ascending: false });

    if (error) {
      console.error("❌ Get All Shift Transactions Error :", error);
      return { data: null, error: "Gagal mengambil data transaksi!" };
    }

    return {
      error: null,
      data: data.map((transaction) => {
        const user = Array.isArray(transaction.user) ? transaction.user[0] : transaction.user;

        return {
          ...transaction,
          user,
          items: transaction.items.map((item) => {
            const product = Array.isArray(item.image) ? item.image[0] : item.image;
            const image = product.image ? `${ENVIRONMENT.SUPABASE_STORAGE_URL}/images/${product.image}` : null;
            return { ...item, image };
          }),
        };
      }),
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Get All Transactions Error :", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

export async function getActiveShiftTransactions() {
  try {
    const supabase = await createClient();

    const { user, shift } = await getCurrentUserAndActiveShift();

    if (!user) redirect("/login");

    if (!shift) return { data: null, error: "Shift belum dibuka! Silahkan buka shift terlebih dahulu." };

    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        id,
        date,
        user: profiles(fullname),
        totalAmount: total_amount,
        paymentMethod: payment_method,
        paidAmount: paid_amount,
        changeAmount: change_amount,
        items: transaction_items (id, productName: product_name, image: products(image), priceAtSale: price_at_sale, quantity, subtotal)
      `,
      )
      .eq("shift_id", shift.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("❌ Get Active Shift Transactions Error :", error);
      return { data: null, error: "Gagal mengambil data transaksi!" };
    }

    return {
      error: null,
      data: data.map((transaction) => {
        const user = Array.isArray(transaction.user) ? transaction.user[0] : transaction.user;

        return {
          ...transaction,
          user,
          items: transaction.items.map((item) => {
            const product = Array.isArray(item.image) ? item.image[0] : item.image;
            const image = product.image ? `${ENVIRONMENT.SUPABASE_STORAGE_URL}/images/${product.image}` : null;
            return { ...item, image };
          }),
        };
      }),
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Get Shift Transactions Error :", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

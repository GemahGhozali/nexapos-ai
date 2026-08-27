"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentUserAndActiveShift } from "../shift/queries";

export async function getActiveShiftExpenses() {
  try {
    const supabase = await createClient();

    const { user, shift } = await getCurrentUserAndActiveShift();

    if (!user) redirect("/login");

    if (!shift) return { data: null, error: "Shift belum dibuka! Silahkan buka shift terlebih dahulu." };

    const { data, error } = await supabase
      .from("expenses")
      .select("id, date, amount, category, paymentMethod: payment_method, description, user: profiles(fullname)")
      .eq("shift_id", shift.id)
      .order("date", { ascending: false });

    if (error) {
      console.log("❌ Get Shift Cashflows Error :", error);
      return { data: null, error: "Gagal mendapatkan data pengeluaran shift!" };
    }

    return {
      error: null,
      data: data.map((expense) => {
        const user = Array.isArray(expense.user) ? expense.user[0] : expense.user;
        return { ...expense, user };
      }),
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Get Shift Cashflows Error :", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

export async function getAllExpenses() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("expenses")
      .select("id, date, amount, category, paymentMethod: payment_method, description, user: profiles(fullname)")
      .order("date", { ascending: false });

    if (error) {
      console.log("❌ Get Shift Cashflows Error :", error);
      return { data: null, error: "Gagal mendapatkan data pengeluaran!" };
    }

    return {
      error: null,
      data: data.map((expense) => {
        const user = Array.isArray(expense.user) ? expense.user[0] : expense.user;
        return { ...expense, user };
      }),
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Get Shift Cashflows Error :", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

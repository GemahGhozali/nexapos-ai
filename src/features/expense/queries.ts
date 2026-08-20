"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentUserAndActiveShift } from "../shift/queries";

export async function getAllExpenses() {
  try {
    const supabase = await createClient();

    const { user, shift } = await getCurrentUserAndActiveShift();

    if (!user) redirect("/login");

    if (!shift) return { data: null, error: "Shift belum dibuka! Silahkan buka shift terlebih dahulu." };

    const { data, error } = await supabase
      .from("cashflows")
      .select("id, date, amount, category, paymentMethod: payment_method, description")
      .eq("shift_id", shift.id)
      .eq("type", "expense")
      .order("date", { ascending: false });

    if (error) {
      console.log("❌ Get Shift Cashflows Error :", error);
      return { data: null, error: "Gagal mendapatkan data arus kas shift!" };
    }

    return { error: null, data };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Get Shift Cashflows Error :", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentUserAndActiveShift } from "../shift/queries";

export async function getAllCashflows() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cashflows")
      .select("id, type, amount, category, paymentMethod: payment_method, date, description, user: profiles(fullname)")
      .order("date", { ascending: false });

    if (error) {
      console.log("❌ Get All Cashflows Error :", error);
      return { data: null, error: "Gagal mendapatkan data arus kas!" };
    }

    return {
      error: null,
      data: data.map((cashflow) => {
        const user = Array.isArray(cashflow.user) ? cashflow.user[0] : cashflow.user;
        return { ...cashflow, user };
      }),
    };
  } catch (error) {
    console.log("❌ Get All Cashflows Error :", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

export async function getActiveShiftCashflows() {
  try {
    const supabase = await createClient();

    const { user, shift } = await getCurrentUserAndActiveShift();

    if (!user) redirect("/login");

    if (!shift) return { data: null, error: "Shift belum dibuka! Silahkan buka shift terlebih dahulu." };

    const { data, error } = await supabase
      .from("cashflows")
      .select("id, type, amount, category, paymentMethod: payment_method, date, description, user: profiles(fullname)")
      .eq("shift_id", shift.id)
      .order("date", { ascending: false });

    if (error) {
      console.log("❌ Get Shift Cashflows Error :", error);
      return { data: null, error: "Gagal mendapatkan data arus kas shift!" };
    }

    return {
      error: null,
      data: data.map((cashflow) => {
        const user = Array.isArray(cashflow.user) ? cashflow.user[0] : cashflow.user;
        return { ...cashflow, user };
      }),
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Get Shift Cashflows Error :", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

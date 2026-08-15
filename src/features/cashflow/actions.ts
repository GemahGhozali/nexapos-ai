"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { formatZodError } from "@/utils/format-zod-error";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentUserAndActiveShift } from "../shift/queries";
import { CashflowInput, CashflowSchema } from "./schemas";

export async function createCashflowData(data: CashflowInput) {
  try {
    const supabase = await createClient();

    const validated = CashflowSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid!",
        errors: formatZodError(validated.error),
      };
    }

    const { paymentMethod, ...cashflowData } = validated.data;

    const { user } = await getCurrentUserAndActiveShift();

    if (!user) redirect("/login");

    const { error } = await supabase.from("cashflows").insert({
      ...cashflowData,
      payment_method: paymentMethod,
      user_id: user.id,
    });

    const cashflowType = cashflowData.type === "income" ? "pemasukan" : "pengeluaran";

    if (error) {
      console.log("❌ Create Cashflow Error:", error);
      return { success: false, message: `Gagal membuat data ${cashflowType}!` };
    }

    return { success: true, message: `Data ${cashflowType} berhasil dibuat!` };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Create Cashflow Error:", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function createCashflowDataInActiveShift(data: CashflowInput) {
  try {
    const supabase = await createClient();

    const validated = CashflowSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid!",
        errors: formatZodError(validated.error),
      };
    }

    const { paymentMethod, ...cashflowData } = validated.data;

    const { user, shift } = await getCurrentUserAndActiveShift();

    if (!user) redirect("/login");

    if (!shift) return { success: false, message: "Shift belum dibuka! Silahkan buka shift terlebih dahulu." };

    const { error } = await supabase.from("cashflows").insert({
      ...cashflowData,
      payment_method: paymentMethod,
      user_id: user.id,
      shift_id: shift.id,
    });

    const cashflowType = cashflowData.type === "income" ? "pemasukan" : "pengeluaran";

    if (error) {
      console.log("❌ Create Cashflow Error:", error);
      return { success: false, message: `Gagal membuat data ${cashflowType}!` };
    }

    return { success: true, message: `Data ${cashflowType} berhasil dibuat!` };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Create Cashflow Error:", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

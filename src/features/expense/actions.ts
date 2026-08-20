"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { formatZodError } from "@/utils/format-zod-error";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ExpenseInput, ExpenseSchema } from "./schemas";
import { getCurrentUserAndActiveShift } from "../shift/queries";

export async function createExpense(data: ExpenseInput) {
  try {
    const supabase = await createClient();

    const validated = ExpenseSchema.safeParse(data);

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
      type: "expense",
      payment_method: paymentMethod,
      user_id: user.id,
      shift_id: shift.id,
    });

    if (error) {
      console.log("❌ Create Cashflow Error:", error);
      return { success: false, message: `Gagal membuat data pengeluaran shift!` };
    }

    return { success: true, message: `Data pengeluaran shift berhasil dibuat!` };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Create Cashflow Error:", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

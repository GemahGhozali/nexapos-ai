"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { formatZodError } from "@/utils/format-zod-error";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentUserAndActiveShift } from "./queries";
import { OpeningShiftSchema, OpeningShiftInput, ClosingShiftSchema, ClosingShiftInput } from "./schemas";

export async function openShift(data: OpeningShiftInput) {
  try {
    const supabase = await createClient();

    const validated = OpeningShiftSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid!",
        errors: formatZodError(validated.error),
      };
    }

    const { openingCash } = validated.data;

    const { user, shift } = await getCurrentUserAndActiveShift();

    if (!user) redirect("/login");

    if (shift) return { success: false, message: "Shift anda masih berstatus aktif!" };

    const { error } = await supabase.from("shifts").insert({ user_id: user.id, opening_cash: openingCash, status: "open" });

    if (error) {
      console.log("❌ Open Shift Error:", error);
      return { success: false, message: "Gagal membuka shift!" };
    }

    revalidatePath("/dashboard", "layout");

    return { success: true, message: "Shift berhasil dibuka!" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Open Shift Error:", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function closeShift(data: ClosingShiftInput) {
  try {
    const supabase = await createClient();

    const validated = ClosingShiftSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid!",
        errors: formatZodError(validated.error),
      };
    }

    const { closingCash } = validated.data;

    const { user, shift } = await getCurrentUserAndActiveShift();

    if (!user) redirect("/login");

    if (!shift) return { success: false, message: "Shift yang ingin ditutup tidak ditemukan!" };

    const { data: totalCashTransactions, error: getTotalCashTransactionsError } = await supabase
      .from("transactions")
      .select("total_amount")
      .eq("shift_id", shift.id)
      .eq("payment_method", "cash");

    if (getTotalCashTransactionsError) {
      console.log("❌ Close Shift Error:", getTotalCashTransactionsError);
      return { success: false, message: "Gagal menutup shift!" };
    }

    const totalCashIn = totalCashTransactions.reduce((total, cash) => total + cash.total_amount, 0);
    const expectedCash = shift.openingCash + totalCashIn;
    const cashDifference = closingCash - expectedCash;

    const { error: closingShiftError } = await supabase
      .from("shifts")
      .update({
        closing_cash: closingCash,
        expected_cash: expectedCash,
        cash_difference: cashDifference,
        status: "closed",
        closed_at: new Date().toISOString(),
      })
      .eq("id", shift.id);

    if (closingShiftError) {
      console.log("❌ Close Shift Error:", closingShiftError);
      return { success: false, message: "Gagal menutup shift!" };
    }

    revalidatePath("/dashboard", "layout");

    return { success: true, message: "Shift berhasil ditutup!" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log("❌ Close Shift Error:", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

"use server";

import { createClient } from "@/libs/supabase/server";
import { QueryResponse } from "@/types";
import { ShiftHistory } from "./types";

export async function getCurrentUserAndActiveShift() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { user: null, shift: null };

    const [profileResponse, shiftResponse] = await Promise.all([
      supabase.from("profiles").select("id, email, fullname, role, profileImage: profile_image").eq("id", user.id).single(),
      supabase
        .from("shifts")
        .select("id, openingCash: opening_cash, status, openedAt: opened_at")
        .eq("user_id", user.id)
        .eq("status", "open")
        .maybeSingle(),
    ]);

    if (profileResponse.error) {
      console.log("❌ Get User Profile Error :", profileResponse.error);
      return { user: null, shift: null };
    }

    if (shiftResponse.error) {
      console.log("❌ Get Active Shift Error :", shiftResponse.error);
      return { user: profileResponse.data, shift: null };
    }

    return { user: profileResponse.data, shift: shiftResponse.data };
  } catch (error) {
    console.log("❌ Get User and Active Shift Error :", error);
    return { user: null, shift: null };
  }
}

export async function getAllShifts(): Promise<QueryResponse<ShiftHistory[]>> {
  try {
    const supabase = await createClient();

    const { data: shifts, error: shiftsError } = await supabase
      .from("shifts")
      .select("id, status, opened_at, cash_difference, user: profiles(fullname)")
      .order("opened_at", { ascending: false });

    if (shiftsError) {
      console.log("❌ Get All Shifts Error :", shiftsError);
      return { data: null, error: "Gagal mengambil data riwayat shift!" };
    }

    if (!shifts || shifts.length === 0) {
      return { data: [], error: null };
    }

    const shiftIds = shifts.map((shift) => shift.id);

    const [transactionsResult, expensesResult] = await Promise.all([
      supabase.from("transactions").select("shift_id, total_amount").in("shift_id", shiftIds),
      supabase.from("expenses").select("shift_id, amount").in("shift_id", shiftIds),
    ]);

    if (transactionsResult.error) {
      console.log("❌ Get Shift Transactions Error :", transactionsResult.error);
      return { data: null, error: "Gagal mengambil data transaksi shift!" };
    }

    if (expensesResult.error) {
      console.log("❌ Get Shift Expenses Error :", expensesResult.error);
      return { data: null, error: "Gagal mengambil data pengeluaran shift!" };
    }

    const transactionMap = new Map<string, number>();
    transactionsResult.data.forEach((transaction) => {
      const existing = transactionMap.get(transaction.shift_id) || 0;
      transactionMap.set(transaction.shift_id, existing + transaction.total_amount);
    });

    const expenseMap = new Map<string, number>();
    expensesResult.data.forEach((expense) => {
      expenseMap.set(expense.shift_id, (expenseMap.get(expense.shift_id) || 0) + expense.amount);
    });

    const data: ShiftHistory[] = shifts.map((shift) => {
      const user = Array.isArray(shift.user) ? shift.user[0] : shift.user;
      const totalIncome = transactionMap.get(shift.id) || 0;
      const totalExpense = expenseMap.get(shift.id) || 0;

      return {
        id: shift.id,
        userName: user.fullname || "-",
        status: shift.status as "open" | "closed",
        totalIncome,
        totalExpense,
        cashDifference: shift.cash_difference,
        openedAt: shift.opened_at,
      };
    });

    return { data, error: null };
  } catch (error) {
    console.log("❌ Get All Shifts Error :", error);
    return { data: null, error: "Terjadi kesalahan pada server!" };
  }
}

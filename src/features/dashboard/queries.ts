"use server";

import { format } from "date-fns";
import { createClient } from "@/libs/supabase/server";

export interface KpiStats {
  totalIncome: number;
  totalExpense: number;
  totalNetIncome: number;
  totalTransactions: number;
}

export interface CashDrawerDetails {
  startingCash: number;
  cashIncome: number;
  cashExpense: number;
  estimatedCashInDrawer: number;
}

export interface PaymentMethodProportionItem {
  paymentMethod: "tunai" | "transfer";
  totalRevenue: number;
  totalTransactions: number;
  fill: string;
}

export interface TransactionTrendItem {
  time: string;
  totalRevenue: number;
  totalTransactions: number;
}

export async function getKpiStats(shiftId: string): Promise<KpiStats> {
  try {
    const supabase = await createClient();

    const [transactions, expenses] = await Promise.all([
      supabase.from("transactions").select("total_amount").eq("shift_id", shiftId),
      supabase.from("expenses").select("amount").eq("shift_id", shiftId),
    ]);

    if (transactions.error || expenses.error) {
      console.log("❌ Get KPI Stats Error :", { transactions: transactions.error, expenses: expenses.error });
      throw new Error("Gagal mengambil data indikator kinerja (KPI)!");
    }

    const totalTransactions = transactions.data.length;
    const totalIncome = transactions.data.reduce((sum, transaction) => sum + transaction.total_amount, 0);
    const totalExpense = expenses.data.reduce((sum, expense) => sum + expense.amount, 0);
    const totalNetIncome = totalIncome - totalExpense;

    return { totalIncome, totalExpense, totalNetIncome, totalTransactions };
  } catch (error) {
    console.log("❌ Get KPI Stats Error :", error);
    if (error instanceof Error) throw error;
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getCashDrawerDetails(shiftId: string): Promise<CashDrawerDetails> {
  try {
    const supabase = await createClient();

    const [shift, transactions, expenses] = await Promise.all([
      supabase.from("shifts").select("opening_cash").eq("id", shiftId).single(),
      supabase.from("transactions").select("total_amount").eq("shift_id", shiftId).eq("payment_method", "cash"),
      supabase.from("expenses").select("amount").eq("shift_id", shiftId).eq("payment_method", "cash"),
    ]);

    if (shift.error || transactions.error || expenses.error) {
      console.log("❌ Get Cash Drawer Stats Error :", { shift: shift.error, transactions: transactions.error, expenses: expenses.error });
      throw new Error("Gagal menghitung rincian laci kas!");
    }

    const startingCash = shift.data.opening_cash;
    const cashIncome = transactions.data.reduce((sum, transaction) => sum + transaction.total_amount, 0);
    const cashExpense = expenses.data.reduce((sum, cashflow) => sum + cashflow.amount, 0);

    return {
      startingCash,
      cashIncome,
      cashExpense,
      estimatedCashInDrawer: startingCash + cashIncome - cashExpense,
    };
  } catch (error) {
    console.error("❌ Internal Server Error [getCashDrawerStats]:", error);
    if (error instanceof Error) throw error;
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getPaymentMethodProportion(shiftId: string): Promise<PaymentMethodProportionItem[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("transactions").select("payment_method, total_amount").eq("shift_id", shiftId);

    if (error) {
      console.log("❌ Get Payment Method Pie Data Error :", error);
      throw new Error("Gagal mengambil data proporsi pembayaran!");
    }

    const cashData = data.filter((transaction) => transaction.payment_method === "cash");
    const totalCashRevenue = cashData.reduce((sum, transaction) => sum + transaction.total_amount, 0);

    const transferData = data.filter((transaction) => transaction.payment_method === "transfer");
    const totalTransferRevenue = transferData.reduce((sum, transaction) => sum + transaction.total_amount, 0);

    return [
      {
        paymentMethod: "tunai",
        totalRevenue: totalCashRevenue,
        totalTransactions: cashData.length,
        fill: "var(--color-tunai)",
      },
      {
        paymentMethod: "transfer",
        totalRevenue: totalTransferRevenue,
        totalTransactions: transferData.length,
        fill: "var(--color-transfer)",
      },
    ];
  } catch (error) {
    console.log("❌ Get Payment Method Pie Data Error :", error);
    if (error instanceof Error) throw error;
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getHourlyTransactionTrend(shiftId: string): Promise<TransactionTrendItem[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("transactions")
      .select("date, total_amount")
      .eq("shift_id", shiftId)
      .order("date", { ascending: true });

    if (error) {
      console.log("❌ Get Hourly Trend Area Data Error:", error);
      throw new Error("Gagal mengambil data tren transaksi!");
    }

    const hourlyGroup = data.reduce<Record<string, { totalRevenue: number; totalTransactions: number }>>((acc, transaction) => {
      const hour = format(new Date(transaction.date), "HH:00");

      if (!acc[hour]) {
        acc[hour] = { totalRevenue: 0, totalTransactions: 0 };
      }

      acc[hour].totalRevenue += transaction.total_amount;
      acc[hour].totalTransactions += 1;

      return acc;
    }, {});

    return Object.entries(hourlyGroup).map(([time, value]) => ({
      time,
      totalRevenue: value.totalRevenue,
      totalTransactions: value.totalTransactions,
    }));
  } catch (error) {
    console.log("❌ Get Hourly Trend Area Data Error:", error);
    if (error instanceof Error) throw error;
    throw new Error("Terjadi kesalahan pada server!");
  }
}

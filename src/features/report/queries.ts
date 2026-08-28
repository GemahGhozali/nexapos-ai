"use server";

import { createClient } from "@/libs/supabase/server";
import { ExpenseByCategory, FinancialReport } from "./types";

interface GetFinancialReportParams {
  startDate?: Date;
  endDate?: Date;
}

export async function getFinancialReport({ startDate, endDate }: GetFinancialReportParams = {}): Promise<FinancialReport> {
  try {
    const supabase = await createClient();

    let transactionsQuery = supabase.from("transactions").select(`totalAmount: total_amount, items: transaction_items(quantity, hpp: hpp_at_sale)`);

    let expensesQuery = supabase.from("expenses").select("category, amount");

    if (startDate) {
      transactionsQuery = transactionsQuery.gte("date", startDate.toISOString());
      expensesQuery = expensesQuery.gte("date", startDate.toISOString());
    }

    if (endDate) {
      transactionsQuery = transactionsQuery.lte("date", endDate.toISOString());
      expensesQuery = expensesQuery.lte("date", endDate.toISOString());
    }

    const [transactions, expenses] = await Promise.all([transactionsQuery, expensesQuery]);

    if (transactions.error || expenses.error) {
      console.log("❌ Get Profit Loss Report Error :", { shift: transactions.error, expenses: expenses.error });
      throw new Error("Gagal mendapatkan laporan keuangan!");
    }

    const totalTransactions = transactions.data.length;

    const totalGrossSales = transactions.data.reduce((sum, transaction) => transaction.totalAmount + sum, 0);

    const totalCogs = transactions.data.reduce((sumHpp, { items }) => {
      const transactionCogs = items.reduce((sumItem, { hpp, quantity }) => sumItem + hpp * quantity, 0);
      return sumHpp + transactionCogs;
    }, 0);

    const totalGrossProfit = totalGrossSales - totalCogs;

    const totalExpenses = expenses.data.reduce((sum, expense) => sum + expense.amount, 0);
    const totalNetProfit = totalGrossProfit - totalExpenses;

    const groupedExpenses = expenses.data.reduce<Record<string, number>>((acc, expense) => {
      const category = expense.category;
      const totalExpenses = acc[category] || 0;

      acc[category] = totalExpenses + expense.amount;

      return acc;
    }, {});

    const expensesByCategory: ExpenseByCategory[] = Object.entries(groupedExpenses).map(([category, total]) => ({ category, total }));

    return { totalTransactions, totalGrossSales, totalCogs, totalGrossProfit, totalExpenses, totalNetProfit, expensesByCategory };
  } catch (error) {
    console.log("❌ Get Profit Loss Report Error :", error);
    if (error instanceof Error) throw error;
    throw new Error("Terjadi kesalahan pada server!");
  }
}

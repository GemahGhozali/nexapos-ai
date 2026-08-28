export type ExpenseByCategory = {
  category: string;
  total: number;
};

export interface FinancialReport {
  totalTransactions: number;
  totalGrossSales: number;
  totalCogs: number;
  totalGrossProfit: number;
  totalExpenses: number;
  totalNetProfit: number;
  expensesByCategory: ExpenseByCategory[];
}

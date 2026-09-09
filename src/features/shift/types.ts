export interface ShiftHistory {
  id: string;
  userName: string;
  status: "open" | "closed";
  totalIncome: number;
  totalExpense: number;
  cashDifference: number | null;
  openedAt: string;
}

export interface ShiftDetail {
  id: string;
  userName: string;
  status: "open" | "closed";
  openingCash: number;
  closingCash: number | null;
  cashDifference: number | null;
  openedAt: string;
  closedAt: string | null;
  totalIncome: number;
  totalExpense: number;
  totalTransactions: number;
  cashIncome: number;
  cashExpense: number;
  paymentMethodProportion: PaymentMethodProportion[];
  expenseByCategory: ExpenseByCategory[];
}

export interface PaymentMethodProportion {
  method: string;
  total: number;
  count: number;
}

export interface ExpenseByCategory {
  category: string;
  total: number;
  count: number;
}

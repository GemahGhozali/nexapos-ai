export interface ShiftHistory {
  id: string;
  userName: string;
  status: "open" | "closed";
  totalIncome: number;
  totalExpense: number;
  cashDifference: number | null;
  openedAt: string;
}

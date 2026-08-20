export type Expense = {
  date: Date;
  amount: number;
  category: string;
  paymentMethod: "cash" | "transfer";
  description: string;
};

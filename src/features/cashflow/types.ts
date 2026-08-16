export type Cashflow = {
  date: Date;
  amount: number;
  category: string;
  type: "income" | "expense";
  paymentMethod: "cash" | "transfer";
  description: string;
  user: { fullname: string } | null;
};

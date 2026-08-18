export type TransactionItem = {
  id: string;
  image: string | null;
  productName: string;
  priceAtSale: number;
  quantity: number;
  subtotal: number;
};

export type Transaction = {
  id: string;
  date: Date;
  user: { fullname: string } | null;
  totalAmount: number;
  paymentMethod: "cash" | "transfer";
  paidAmount: number;
  changeAmount: number;
  items: TransactionItem[];
};

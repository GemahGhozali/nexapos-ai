import {
  UserIcon,
  CashierIcon,
  Money04Icon,
  PrinterIcon,
  Calendar04Icon,
  ShoppingCart01Icon,
  ReverseWithdrawal01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/libs/shadcn";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { formatToIDR } from "@/utils/format-to-idr";
import { Transaction } from "../types";
import { HugeiconsIcon } from "@hugeicons/react";

interface TransactionSummaryProps {
  transaction: Transaction;
}

export function TransactionSummary({ transaction }: TransactionSummaryProps) {
  const totalItem = transaction.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="p-3 space-y-3 border rounded-lg bg-secondary">
      <p className="font-semibold">Ringkasan Transaksi</p>
      <Separator />
      <div className="flex justify-between gap-3">
        <p className="text-muted-foreground flex items-center gap-2">
          <HugeiconsIcon icon={Calendar04Icon} size={16} strokeWidth={2} color="currentColor" />
          Tanggal Transaksi
        </p>
        <p className="font-medium">{format(transaction.date, "dd/MM/yyyy")}</p>
      </div>
      <div className="flex justify-between gap-3">
        <p className="text-muted-foreground flex items-center gap-2">
          <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={2} color="currentColor" />
          Kasir
        </p>
        <p className={cn(!transaction?.user && "italic", "font-medium")}>{transaction?.user?.fullname || "Tidak ada"}</p>
      </div>
      <div className="flex justify-between gap-3">
        <p className="text-muted-foreground flex items-center gap-2">
          <HugeiconsIcon icon={ShoppingCart01Icon} size={16} strokeWidth={2} color="currentColor" />
          Total Item
        </p>
        <p className="font-medium">{totalItem} Item</p>
      </div>
      <div className="flex justify-between gap-3">
        <p className="text-muted-foreground flex items-center gap-2">
          <HugeiconsIcon icon={PrinterIcon} size={16} strokeWidth={2} color="currentColor" />
          Metode Pembayaran
        </p>
        <p className="font-medium">{transaction.paymentMethod === "cash" ? "Tunai" : "Transfer"}</p>
      </div>
      <div className="flex justify-between gap-3">
        <p className="text-muted-foreground flex items-center gap-2">
          <HugeiconsIcon icon={CashierIcon} size={16} strokeWidth={2} color="currentColor" />
          Total Keseluruhan
        </p>
        <p className="font-medium">{formatToIDR(transaction.totalAmount)}</p>
      </div>
      <div className="flex justify-between gap-3">
        <p className="text-muted-foreground flex items-center gap-2">
          <HugeiconsIcon icon={Money04Icon} size={16} strokeWidth={2} color="currentColor" />
          Nominal Pembayaran
        </p>
        <p className="font-medium">{formatToIDR(transaction.paidAmount)}</p>
      </div>
      <div className="flex justify-between gap-3">
        <p className="text-muted-foreground flex items-center gap-2">
          <HugeiconsIcon icon={ReverseWithdrawal01Icon} size={16} strokeWidth={2} color="currentColor" />
          Total Kembalian
        </p>
        <p className="font-medium">{formatToIDR(transaction.changeAmount)}</p>
      </div>
    </div>
  );
}

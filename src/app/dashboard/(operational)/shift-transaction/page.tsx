import { TransactionTable } from "@/features/transaction/components/transaction-table";

export default function ShiftTransactionPage() {
  return (
    <TransactionTable
      title="Transaksi Shift"
      description="Semua riwayat transaksi selama sesi operasional shift."
      showDataFromActiveShiftOnly={true}
    />
  );
}

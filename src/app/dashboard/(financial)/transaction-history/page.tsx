import { TransactionTable } from "@/features/transaction/components/transaction-table";

export default function TransactionHistoryPage() {
  return (
    <TransactionTable
      title="Riwayat Transaksi"
      description="Semua riwayat transaksi yang tercatat oleh sistem."
      showDataFromActiveShiftOnly={false}
    />
  );
}

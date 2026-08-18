import { TransactionTable } from "@/features/transaction/components/transaction-table";

export default function TransactionPage() {
  return (
    <TransactionTable
      title="Riwayat Transaksi"
      description="Pantau semua riwayat transaksi yang tercatat oleh sistem."
      showDataFromActiveShiftOnly={false}
    />
  );
}

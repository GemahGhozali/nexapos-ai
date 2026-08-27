import { ExpenseTable } from "@/features/expense/components/expense-table";

export default function ExpenseHistoryPage() {
  return (
    <ExpenseTable
      title="Riwayat Pengeluaran"
      description="Semua riwayat pengeluaran yang tercatat oleh sistem."
      showDataFromActiveShiftOnly={false}
      insertDataIntoActiveShift={false}
    />
  );
}

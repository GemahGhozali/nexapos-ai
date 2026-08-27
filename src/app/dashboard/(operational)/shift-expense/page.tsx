import { ExpenseTable } from "@/features/expense/components/expense-table";

export default function OperationalCashflowPage() {
  return (
    <ExpenseTable
      title="Pengeluaran Shift"
      description="Riwayat pengeluaran selama sesi shift berlangsung."
      showDataFromActiveShiftOnly={true}
      insertDataIntoActiveShift={true}
    />
  );
}

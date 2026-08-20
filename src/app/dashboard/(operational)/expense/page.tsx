import { CashflowTable } from "@/features/cashflow/components/cashflow-table";

export default function OperationalCashflowPage() {
  return (
    <CashflowTable
      title="Kas Operasional"
      description="Pantau riwayat mutasi kas selama sesi operasional shift."
      showDataFromActiveShiftOnly={true}
    />
  );
}

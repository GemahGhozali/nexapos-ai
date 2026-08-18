import { CashflowTable } from "@/features/cashflow/components/cashflow-table";

export default function CashflowMutationPage() {
  return (
    <CashflowTable
      title="Riwayat Mutasi Kas"
      description="Pantau semua riwayat mutasi kas yang tercatat oleh sistem."
      showDataFromActiveShiftOnly={false}
    />
  );
}

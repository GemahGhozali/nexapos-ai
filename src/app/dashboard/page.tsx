import { CloseShiftFormDialog } from "@/features/shift/components/close-shift-form-dialog";

export default function DashboardPage() {
  return (
    <div className="flex justify-between items-end gap-6">
      <div className="space-y-1">
        <p className="font-heading font-semibold">Shift Overview</p>
        <p className="text-sm text-muted-foreground">Pantau ringkasan penjualan dan aktivitas kas selama shift aktif</p>
      </div>
      <CloseShiftFormDialog />
    </div>
  );
}

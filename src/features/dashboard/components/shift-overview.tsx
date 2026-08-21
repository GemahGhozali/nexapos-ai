import { getCurrentTime } from "@/utils/get-current-time";
import { ShiftKpiStatsCards } from "@/features/dashboard/components/shift-kpi-stats-cards";
import { CloseShiftFormDialog } from "@/features/shift/components/close-shift-form-dialog";
import { PaymentMethodPieChart } from "@/features/dashboard/components/payment-method-pie-chart";
import { OperationalCashTracker } from "@/features/dashboard/components/operational-cash-tracker";
import { TransactionTrendAreaChart } from "@/features/dashboard/components/transaction-trend-area-chart";
import { getCurrentUserAndActiveShift } from "@/features/shift/queries";
import { getKpiStats, getCashDrawerDetails, getPaymentMethodProportion, getHourlyTransactionTrend } from "@/features/dashboard/queries";

export async function ShiftOverview() {
  const { user, shift } = await getCurrentUserAndActiveShift();

  if (!shift) return null;

  const [kpiStats, cashDrawerStats, paymentMethodPieData, hourlyTrendAreaData] = await Promise.all([
    getKpiStats(shift.id),
    getCashDrawerDetails(shift.id),
    getPaymentMethodProportion(shift.id),
    getHourlyTransactionTrend(shift.id),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-6">
        <div className="space-y-1">
          <p className="text-xl font-medium">
            Selamat {getCurrentTime()}, {user.fullname}! 🙌
          </p>
          <p className="text-sm text-muted-foreground">Lihat ringkasan penjualan dan aktivitas kas selama sesi shift berlangsung.</p>
        </div>
        <CloseShiftFormDialog />
      </div>
      <ShiftKpiStatsCards data={kpiStats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OperationalCashTracker data={cashDrawerStats} />
        <PaymentMethodPieChart data={paymentMethodPieData} />
      </div>
      <TransactionTrendAreaChart data={hourlyTrendAreaData} />
    </div>
  );
}

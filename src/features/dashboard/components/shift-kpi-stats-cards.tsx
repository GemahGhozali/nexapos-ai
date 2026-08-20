import { KpiStats } from "../queries";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CashierIcon, ShoppingCart01Icon, TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons";

interface ShiftStatsCardsProps {
  data: KpiStats;
}

export function ShiftKpiStatsCards({ data }: ShiftStatsCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <div className="text-emerald-600 bg-primary/20 size-12 rounded-full grid place-content-center mb-4">
            <HugeiconsIcon icon={TradeUpIcon} size={24} color="currentColor" strokeWidth={1.5} />
          </div>
          <CardDescription>Total Omzet Keseluruhan</CardDescription>
          <CardTitle className="text-2xl">{formatToIDR(data.totalIncome)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className="text-emerald-600 bg-primary/20 size-12 rounded-full grid place-content-center mb-4">
            <HugeiconsIcon icon={TradeDownIcon} size={24} color="currentColor" strokeWidth={1.5} />
          </div>
          <CardDescription>Total Pengeluaran</CardDescription>
          <CardTitle className="text-2xl">{formatToIDR(data.totalExpense)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className="text-emerald-600 bg-primary/20 size-12 rounded-full grid place-content-center mb-4">
            <HugeiconsIcon icon={CashierIcon} size={24} color="currentColor" strokeWidth={1.5} />
          </div>
          <CardDescription>Total Omzet Transaksi Kasir</CardDescription>
          <CardTitle className="text-2xl">{formatToIDR(data.totalRevenue)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className="text-emerald-600 bg-primary/20 size-12 rounded-full grid place-content-center mb-4">
            <HugeiconsIcon icon={ShoppingCart01Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </div>
          <CardDescription>Total Transaksi</CardDescription>
          <CardTitle className="text-2xl">{data.totalTransactions}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

import { cn } from "@/libs/shadcn";
import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { FinancialReport } from "../types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart01Icon, Analytics01Icon, TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons";

interface FinancialKpiStatsCardProps {
  data: FinancialReport;
}

export function FinancialKpiStatsCard({ data }: FinancialKpiStatsCardProps) {
  const isProfit = data.totalNetProfit > 0;
  const isEven = data.totalNetProfit === 0;

  return (
    <div className="grid grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <div className="text-emerald-600 bg-primary/20 size-12 rounded-full grid place-content-center mb-4">
            <HugeiconsIcon icon={TradeUpIcon} size={24} color="currentColor" strokeWidth={1.5} />
          </div>
          <CardDescription>Pemasukan Transaksi</CardDescription>
          <CardTitle className="text-2xl">{formatToIDR(data.totalGrossSales)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className="text-emerald-600 bg-primary/20 size-12 rounded-full grid place-content-center mb-4">
            <HugeiconsIcon icon={TradeDownIcon} size={24} color="currentColor" strokeWidth={1.5} />
          </div>
          <CardDescription>Pengeluaran HPP & Operasional</CardDescription>
          <CardTitle className="text-2xl">{formatToIDR(data.totalExpenses + data.totalCogs)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className="text-emerald-600 bg-primary/20 size-12 rounded-full grid place-content-center mb-4">
            <HugeiconsIcon icon={Analytics01Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </div>
          <CardDescription>Laba/Rugi Bersih</CardDescription>
          <CardTitle className={cn("text-2xl", isEven ? "" : isProfit ? "before:content-['+_']" : "before:content-['-_']")}>
            {formatToIDR(Math.abs(data.totalNetProfit))}
          </CardTitle>
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

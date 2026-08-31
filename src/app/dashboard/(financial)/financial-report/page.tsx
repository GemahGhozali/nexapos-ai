import { CopilotSheet } from "@/features/ai/copilot/components/copilot-sheet";
import { getFinancialReport } from "@/features/report/queries";
import { FinancialKpiStatsCard } from "@/features/report/components/financial-kpi-stats-card";
import { ProfitLossCalucalation } from "@/features/report/components/profit-loss-calculation";
import { GenerativeInsightPanel } from "@/features/ai/generative-insight/components/generative-insight-panel";

export default async function FinancialReportPage() {
  const data = await getFinancialReport();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-6">
        <div className="space-y-1">
          <p className="text-xl font-medium">Rekap Keuangan</p>
          <p className="text-sm text-muted-foreground">Lihat ringkasan penjualan dan aktivitas kas selama sesi shift berlangsung.</p>
        </div>
      </div>
      <FinancialKpiStatsCard data={data} />
      <div className="grid grid-cols-5 mb-0 gap-6">
        <div className="col-span-2">
          <ProfitLossCalucalation data={data} />
        </div>
        <div className="col-span-3">
          <GenerativeInsightPanel />
        </div>
      </div>
      <CopilotSheet />
    </div>
  );
}

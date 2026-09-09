import { redirect } from "next/navigation";
import { getShiftDetail } from "@/features/shift/queries";
import { ShiftDetailKpi } from "@/features/shift/components/shift-detail-kpi";
import { ShiftDetailHeader } from "@/features/shift/components/shift-detail-header";
import { ShiftDetailPieChart } from "@/features/shift/components/shift-detail-pie-chart";
import { ShiftDetailCashTracker } from "@/features/shift/components/shift-detail-cash-tracker";

interface ShiftDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShiftDetailPage({ params }: ShiftDetailPageProps) {
  const { id } = await params;

  const { data, error } = await getShiftDetail(id);

  if (error || !data) {
    redirect("/dashboard/shift-operational-history");
  }

  return (
    <div className="space-y-6">
      <ShiftDetailHeader data={data} />
      <ShiftDetailKpi data={data} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShiftDetailCashTracker data={data} />
        <ShiftDetailPieChart data={data} />
      </div>
    </div>
  );
}

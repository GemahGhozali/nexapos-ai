import { Suspense } from "react";
import { ShiftOverview } from "@/features/dashboard/components/shift-overview";
import { ShiftOverviewSkeleton } from "@/features/dashboard/components/shift-overview-skeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<ShiftOverviewSkeleton />}>
      <ShiftOverview />
    </Suspense>
  );
}

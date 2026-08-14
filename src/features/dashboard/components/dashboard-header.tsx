import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";

export function DashboardHeader() {
  return (
    <header className="w-full flex items-center gap-4 p-6 pb-0">
      <SidebarTrigger size="icon-lg" />
      <DashboardBreadcrumb />
    </header>
  );
}

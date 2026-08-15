import { redirect } from "next/navigation";
import { ShiftGateway } from "@/features/shift/components/shift-gateway";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { getCurrentUserAndActiveShift } from "@/features/shift/queries";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, shift } = await getCurrentUserAndActiveShift();

  if (!user) redirect("/login");

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <main className="grow min-w-0">
        <DashboardHeader />
        <div className="w-full p-6">
          <ShiftGateway hasActiveShift={!!shift}>{children}</ShiftGateway>
        </div>
      </main>
    </SidebarProvider>
  );
}

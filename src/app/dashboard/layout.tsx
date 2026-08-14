import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { getCurrentUserProfile } from "@/features/auth/queries";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUserProfile();

  if (!user) redirect("/login");

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <main className="grow min-w-0">
        <DashboardHeader />
        <div className="w-full p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}

import { UserProfile } from "./user-profile";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardHeader() {
  return (
    <header className="w-full flex items-center justify-between p-6">
      <SidebarTrigger />
      <UserProfile />
    </header>
  );
}

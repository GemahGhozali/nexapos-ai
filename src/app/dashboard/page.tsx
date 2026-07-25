import UserProfile from "@/features/dashboard/components/user-profile";

export default function DashboardPage() {
  return (
    <div className="w-full flex items-center justify-between p-4">
      <p>Dashboard Page </p>
      <UserProfile />
    </div>
  );
}

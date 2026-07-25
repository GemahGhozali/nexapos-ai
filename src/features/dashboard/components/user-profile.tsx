import LogoutButton from "./logout-button";
import ThemeToggler from "./theme-toggler";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCurrentUserProfile } from "@/features/auth/queries";

export default async function UserProfile() {
  const user = await getCurrentUserProfile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-lg" className="rounded-full">
            <Avatar size="lg">
              <AvatarImage src={user?.profileImage} alt="shadcn" />
              <AvatarFallback className="font-semibold">{getInitials(user?.fullname)}</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-80">
        <div className="p-3">
          <h6>{user ? user.fullname : "Full Name"}</h6>
          <p className="text-sm text-muted-foreground">{user ? user.email : "account@gmail.com"}</p>
        </div>
        <DropdownMenuSeparator />
        <ThemeToggler />
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function getInitials(fullName: string): string {
  if (!fullName) return "";

  const words = fullName.trim().split(/\s+/);

  if (words.length === 0 || !words[0]) return "";

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const firstInitial = words[0].charAt(0);
  const secondInitial = words[1].charAt(0);

  return `${firstInitial}${secondInitial}`.toUpperCase();
}

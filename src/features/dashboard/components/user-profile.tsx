import { User } from "@/features/user/types";
import { LogoutButton } from "./logout-button";
import { ThemeToggler } from "./theme-toggler";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton className="p-3 h-auto gap-3">
            <Avatar size="lg">
              <AvatarImage src={user.profileImage || ""} alt="shadcn" />
              <AvatarFallback className="font-semibold">{generateNameInitials(user.fullname)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">{user.fullname}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </SidebarMenuButton>
        }
      />
      <DropdownMenuContent>
        <div className="p-3">
          <p>{user.fullname}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <ThemeToggler />
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

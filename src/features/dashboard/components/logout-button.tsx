"use client";

import { Spinner } from "@/components/ui/spinner";
import { useLogout } from "@/features/auth/hooks";
import { HugeiconsIcon } from "@hugeicons/react";
import { LogoutSquare01Icon } from "@hugeicons/core-free-icons";
import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function LogoutButton() {
  const { logout, isPending } = useLogout();

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem variant="destructive" disabled={isPending} onClick={() => logout()}>
        <HugeiconsIcon icon={LogoutSquare01Icon} size={24} color="currentColor" strokeWidth={2} />
        {isPending ? "Processing" : "Logout"}
        {isPending && <Spinner className="ml-auto" />}
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}

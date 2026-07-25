"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogout } from "@/features/auth/hooks";

export default function LogoutButton() {
  const { logout, isPending } = useLogout();

  return (
    <Button type="button" variant="destructive" disabled={isPending} onClick={() => logout()}>
      {isPending ? "Processing" : "Logout"}
      {isPending && <Spinner data-icon="inline-start" />}
    </Button>
  );
}

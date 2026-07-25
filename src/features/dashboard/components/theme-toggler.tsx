"use client";

import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>THEME SELECTIONS</DropdownMenuLabel>
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value="system">
          <HugeiconsIcon icon={Settings01Icon} size={24} color="currentColor" strokeWidth={2} />
          System
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">
          <HugeiconsIcon icon={Moon02Icon} size={24} color="currentColor" strokeWidth={2} />
          Dark
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="light">
          <HugeiconsIcon icon={Sun03Icon} size={24} color="currentColor" strokeWidth={2} />
          Light
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuGroup>
  );
}

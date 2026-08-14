"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { cn } from "@/libs/shadcn";
import { User } from "@/features/user/types";
import { UserProfile } from "./user-profile";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSelectedLayoutSegments } from "next/navigation";
import { filterRouteGroupFromSegments } from "../utils";
import { adminMenus, mainMenus, masterDataMenus } from "../constants";

interface DashboardSidebarProps {
  user: User;
}

const sidebarGroups = [
  {
    title: "MENU OPERASIONAL",
    items: mainMenus,
  },
  {
    title: "MENU ADMIN",
    roles: "admin",
    items: adminMenus,
  },
  {
    title: "DATA MASTER",
    roles: "admin",
    items: masterDataMenus,
  },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const rawSegments = useSelectedLayoutSegments();
  const segments = filterRouteGroupFromSegments(rawSegments);

  const activeSegment = segments[0] ?? null;

  const filteredGroups = sidebarGroups.filter((group) => {
    if (!group.roles) return true;
    return group.roles === user.role;
  });

  return (
    <Sidebar className="*:bg-sidebar">
      <SidebarHeader className="p-6">
        <h1 className="font-semibold text-sm text-foreground">NexaPOS AI</h1>
        <p className="text-xs text-muted-foreground">AI Powered POS Application</p>
      </SidebarHeader>
      <SidebarContent className="gap-3">
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.title} className="p-3 pt-0">
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu className="gap-3">
              {group.items.map((menu) => (
                <SidebarMenuItem key={menu.label}>
                  <SidebarMenuButton className="p-0 rounded-sm">
                    <Link
                      href={menu.href}
                      className={cn(
                        "w-full flex items-center gap-2 p-3 text-muted-foreground",
                        activeSegment === menu.segment && "bg-primary text-white font-medium",
                      )}
                    >
                      <HugeiconsIcon icon={menu.icon} size={24} color="currentColor" strokeWidth={2} />
                      <span>{menu.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserProfile user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

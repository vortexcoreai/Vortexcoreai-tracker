"use client";

import { LayoutDashboardIcon, TimerIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const month = new Date().getMonth() + 1;

const data = {
  navMain: [
    {
      title: "Attendance",
      url: `/attendance?year=2025&month=${month}`,
      icon: LayoutDashboardIcon,
    },
    {
      title: "Timer",
      url: "/",
      icon: TimerIcon,
    },
    {
      title: "Manage",
      url: "/manage",
      icon: UsersIcon,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/" className="p-0">
                <Image src="/vortex.png" width={40} height={40} alt="logo" />
                <span className="text-base font-semibold">VortexCoreAI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

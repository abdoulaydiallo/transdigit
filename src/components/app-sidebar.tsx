"use client"

import * as React from "react"
import {
  BookOpen,
  GalleryVerticalEnd,
  Home,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const data = {
  user: {
    name: session?.user?.name || "Abdoulaye Diallo",
    email: session?.user?.email || "contact@goulotech.com",
    avatar: session?.user?.image || "/img/logo.png",
  },
  teams: [
    {
      name: "TransDigit",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Fonctionnalités",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Accueil",
          url: "/dashboard",
          icon: Home,
          isActive: true,
        },
        {
          title: "Cours",
          url: "/dashboard/courses",
          icon: BookOpen,
        },
      ],
    },
  ],
  
}
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

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

// This is sample data.
const data = {
  user: {
    name: "Abdoulaye Diallo",
    email: "contact@goulotech.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Goulotech",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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

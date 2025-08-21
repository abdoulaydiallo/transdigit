"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "../Logo";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const { data: session } = useSession();

  // Données utilisateur statiques (à dynamiser avec authentification)
  const user =  {
    name: session?.user?.name || "John Doe",
    email: session?.user?.email || "user@example.com",
    avatar: session?.user?.image || "/avatars/user.jpg",
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 py-2 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6">
      {/* Trigger pour toggler le sidebar (visible sur mobile) */}
     <SidebarTrigger />

      {/* Titre/Logo */}
      <Logo width={32} height={32} logoName />

      {/* Menu Utilisateur */}
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

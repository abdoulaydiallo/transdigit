import { cn } from "@/lib/utils";
import Link from "next/link";
import { Home, BookOpen, Users, Settings } from "lucide-react";

export function Sidebar() {
  const navItems = [
    { name: "Accueil", href: "/dashboard", icon: Home },
    { name: "Cours", href: "/dashboard/courses", icon: BookOpen },
    { name: "Utilisateurs", href: "/dashboard/users", icon: Users },
    { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="sr-only">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

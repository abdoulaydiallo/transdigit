"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import { MenuIcon, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hash, setHash] = useState("");

  // Gérer location.hash côté client pour éviter "location is not defined"
  useEffect(() => {
    setHash(window.location.hash);
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const links = [
    {
      title: "Formations",
      href: "/#homeBootcourses",
      active: pathname === "/" && hash === "#homeBootcourses",
    },
    {
      title: "Pourquoi Goulotech",
      href: "/#homeWhyChoose",
      active: pathname === "/" && hash === "#homeWhyChoose",
    },
    {
      title: "Événements",
      href: "/events",
      active: pathname === "/events",
    },
    {
      title: "Entreprise",
      href: "/business",
      active: pathname === "/business",
    },
  ];

  return (
    <div className="my-2">
      <Container>
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Liens pour desktop (visible à partir de lg) */}
          <ul className="hidden lg:flex gap-4 items-center">
            {links.map((link) => (
              <li
                key={link.title}
                className={`text-base px-2 py-1.5 rounded-md transition-all duration-200 ${
                  link.active
                    ? "text-black font-semibold bg-[#670BFF]/10"
                    : "text-black hover:text-[#670BFF] hover:bg-[#670BFF]/5 hover:font-semibold"
                }`}
              >
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className="focus-visible:ring-[#670BFF] focus-visible:ring-2 focus-visible:outline-none rounded-md"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Bouton Postuler pour desktop */}
          <Link href="/apply" className="hidden lg:block cursor-pointer">
            <Button
              size="lg"
              className="bg-[#670BFF] hover:bg-[#5208CC]  text-white px-4 py-2 rounded-md focus-visible:ring-[#670BFF] focus-visible:ring-2"
              aria-label="Postuler à Goulotech Conakry"
            >
              Postuler maintenant
            </Button>
          </Link>

          {/* Bouton Menu Hamburger avec Sheet pour mobile et tablette */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="lg:hidden p-2 focus-visible:ring-[#670BFF] focus-visible:ring-2 focus-visible:outline-none rounded-md"
                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <X size={36} /> : <MenuIcon size={36} />}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className=" bg-white p-4 sm:p-6 md:p-8 flex flex-col"
            >
              <SheetTitle className="hidden">Menu de navigation</SheetTitle>
              <ul className="flex flex-col gap-4 w-full">
                {links.map((link) => (
                  <li
                    key={link.title}
                    className={`text-lg px-4 py-2 rounded-md transition-all duration-200 text-center ${
                      link.active
                        ? "text-black font-semibold bg-[#670BFF]/10"
                        : "text-muted-foreground hover:text-[#670BFF] hover:bg-[#670BFF]/5 hover:font-semibold"
                    }`}
                  >
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        aria-current={link.active ? "page" : undefined}
                        className="block focus-visible:ring-[#670BFF] focus-visible:ring-2 focus-visible:outline-none rounded-md"
                      >
                        {link.title}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
              <SheetClose asChild>
                <Link href="/apply" className="mt-6 w-full">
                  <Button
                    size="lg"
                    className="w-full bg-[#670BFF] hover:bg-[#5208CC] text-white px-4 py-2 rounded-md focus-visible:ring-[#670BFF] focus-visible:ring-2"
                    aria-label="Postuler à Goulotech Conakry"
                  >
                    Postuler
                  </Button>
                </Link>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </div>
  );
};
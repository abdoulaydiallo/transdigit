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
import { FiArrowRight } from "react-icons/fi";

export const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const links = [
    {
      title: "Formations",
      href: "/",
      active: pathname === "/" && hash === "/",
    },
    {
      title: "Pourquoi nous ?",
      href: "/#homeWhyChoose",
      active: pathname === "/" && hash === "#homeWhyChoose",
    },
    {
      title: "Événements",
      href: "/events",
      active: pathname === "/#events",
    },
    {
      title: "Entreprise",
      href: "/business",
      active: pathname === "/#business",
    },
  ];

  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100 animate-slide-in">
      <>
        <div className="h-18 flex items-center justify-between px-4 sm:px-6 md:px-12">
          {/* Logo */}
            <Logo
              width={48}
              height={48}
              logoName
            />

          {/* Liens pour desktop */}
          <ul className="hidden lg:flex gap-6 items-center">
            {links.map((link) => (
              <li
                key={link.title}
                className={`relative text-lg font-normal transition-all duration-300 ${
                  link.active ? "text-gray-900" : "text-gray-900 hover:text-secondary"
                }`}
              >
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className="block focus-visible:ring-secondary focus-visible:ring-2 focus-visible:outline-none rounded-md after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-secondary after:w-1/2 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Bouton Postuler pour desktop */}
          <Link href="/apply">
            <Button
              size="lg"
              className="hidden lg:flex px-6 items-center gap-2 group"
              aria-label="Postuler à Goulotech Conakry"
            >
              Postuler maintenant
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>

          {/* Menu Hamburger pour mobile/tablette */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="lg:hidden p-2 text-gray-600 hover:text-secondary hover:bg-secondary/5 focus-visible:ring-secondary focus-visible:ring-2 focus-visible:outline-none rounded-lg"
                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-white p-6 md:p-8 flex flex-col items-center justify-center"
            >
              <SheetTitle className="hidden">Menu de navigation</SheetTitle>
              <ul className="flex flex-col gap-4 w-full mb-8">
                {links.map((link) => (
                  <li
                    key={link.title}
                    className={`text-lg font-bold px-4 py-3 rounded-lg transition-all duration-300 text-center ${
                      link.active
                        ? "text-gray-900 bg-secondary/10 border border-secondary/30"
                        : "text-gray-600 hover:text-secondary hover:bg-secondary/10"
                    }`}
                  >
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        aria-current={link.active ? "page" : undefined}
                        className="block focus-visible:ring-secondary focus-visible:ring-2 focus-visible:outline-none rounded-lg"
                      >
                        {link.title}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
              <SheetClose asChild>
                <Link href="/apply" className="w-full">
                  <Button
                    size="lg"
                    className="w-full bg-secondary hover:bg-secondary/80 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-secondary/20 hover:scale-110 flex items-center gap-2 group"
                    aria-label="Postuler à Goulotech Conakry"
                  >
                    Postuler
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </>
    </div>
  );
};
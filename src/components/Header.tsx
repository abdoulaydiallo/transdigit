import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

// Define types for navigation items
interface NavItem {
  label: string;
  href: string;
  isButton?: boolean;
}

// Props interface for the Header component
interface HeaderProps {
  logoText?: string;
  logoSrc?: string;
  logoAlt?: string;
  navItems?: NavItem[];
  ctaText?: string;
  ctaHref?: string;
}

// Default navigation items
const defaultNavItems: NavItem[] = [
  { label: 'Cours', href: '/cours' },
  { label: 'Campus', href: '/campus' },
  { label: 'Pour les entreprises', href: '/entreprises' },
  { label: 'Blog', href: '/blog' },
];

// Header component
const Header: React.FC<HeaderProps> = ({
  logoText = 'Goulotech',
  logoSrc = '/img/logo.svg',
  logoAlt = 'Logo Goulotech',
  navItems = defaultNavItems,
  ctaText = 'Postuler maintenant',
  ctaHref = '/postuler',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 mr-auto">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={30}
                height={30}
                priority
                className="object-contain"
              />
              <span className="text-2xl font-bold text-gray-900">{logoText}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center mr-5" aria-label="Navigation principale">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 text-lg font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section: CTA */}
          <div className="hidden md:flex items-center">
            <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href={ctaHref}>{ctaText}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Ouvrir le menu"
                  className="text-gray-700 hover:text-blue-600"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <SheetTitle className="sr-only">Menu de navigation mobile</SheetTitle>
                <nav className="flex flex-col space-y-4 mt-6 px-2.5" aria-label="Navigation mobile">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href={ctaHref} onClick={() => setIsMenuOpen(false)}>
                      {ctaText}
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
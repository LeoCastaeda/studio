"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Car, Wrench, ShieldCheck, HelpCircle, Send, X, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/products", label: "Productos", icon: Car },
  { href: "/finder", label: "Buscador de Cristales", icon: Wrench },
  { href: "/quote", label: "Solicitar Cotización", icon: Send },
  { href: "/warranty", label: "Garantía", icon: ShieldCheck },
  { href: "/faq", label: "Preguntas Frecuentes", icon: HelpCircle },
  { href: "/contact", label: "Contacto", icon: Send },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({ href, label, className = '' }: { href: string; label: string; className?: string }) => (
    <Link
      href={href}
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname.startsWith(href) ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              GlassNou Online
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between md:justify-end">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir Menú</span>
              </Button>
            </SheetTrigger>
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-bold">GlassNou Online</span>
            </Link>
            <SheetContent side="left" className="pr-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between pb-6 pr-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <Logo className="h-6 w-6 text-primary" />
                        <span className="font-bold">GlassNou Online</span>
                    </Link>
                    <SheetTrigger asChild>
                         <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cerrar Menú</span>
                        </Button>
                    </SheetTrigger>
                </div>
                <div className="flex flex-col space-y-4 pr-6">
                  {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname.startsWith(href)
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex items-center space-x-2">
            <Button asChild>
              <Link href="/contact">Contáctanos</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
    
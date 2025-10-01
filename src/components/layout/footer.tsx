import Link from "next/link";
import { Logo } from "@/components/logo";
import { Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex items-center space-x-2">
              <Logo className="h-8 w-8 text-primary" />
              <p className="text-xl font-bold">GlassNou Online</p>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Tu socio de confianza para cristales de automoción de alta calidad.
            </p>
            <div className="mt-8 flex space-x-4">
              <Link href="https://www.facebook.com/glassnou/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Servicios</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <Link href="/finder" className="text-muted-foreground hover:text-primary">
                  Buscador Visual
                </Link>
                <Link href="/quote" className="text-muted-foreground hover:text-primary">
                  Cotiza Aquí
                </Link>
                <Link href="/products" className="text-muted-foreground hover:text-primary">
                  Catálogo de Servicios
                </Link>
              </nav>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Sobre Nosotros</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm">
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  Preguntas Frecuentes
                </Link>
                <Link href="/warranty" className="text-muted-foreground hover:text-primary">
                  Garantía
                </Link>
              </nav>
            </div>
            
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Contáctanos</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="text-muted-foreground">
                  <a href="mailto:info@glassnou.com" className="hover:text-primary">
                    info@glassnou.com
                  </a>
                </li>
                <li className="text-muted-foreground">
                  <a href="tel:686770074" className="hover:text-primary">
                    686 77 00 74
                  </a>
                </li>
                <li className="text-muted-foreground">
                  Carrer de la Ciutat d'Asunción, 24, 08030 Barcelona
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GlassNou Online. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Facebook, Instagram, Phone, MessageCircle } from "lucide-react";
import { TikTokIcon } from "@/components/icons/tiktok-icon";

const PHONE = "+34686770074";
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hola, necesito información sobre vuestros servicios de lunas.")}`;

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover object-[50%_30%] md:object-center"
        aria-hidden="true"
      >
        <source src="/video/footer.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-gray-950/90" aria-hidden="true" />

      {/* Contenido */}
      <div className="relative z-10">
        {/* CTA superior */}
        <div className="border-b border-gray-800/60 py-10 px-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-lg font-bold text-white">¿Tienes una luna rota?</p>
              <p className="text-gray-400 text-sm">Llámanos o escríbenos — te atendemos hoy mismo.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a
                href={`tel:${PHONE}`}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                <Phone className="h-4 w-4" />
                +34 686 770 074
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Marca */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="flex items-center space-x-2">
                <Logo className="h-8 w-8 text-red-500" />
                <p className="text-xl font-bold text-white">glassnou online</p>
              </div>
              <p className="mt-4 max-w-xs text-sm text-gray-400">
                Tu socio de confianza para cristales de automoción de alta calidad en Barcelona.
              </p>
              <div className="mt-6 flex space-x-4">
                <Link href="https://www.facebook.com/glassnou/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="https://www.instagram.com/glassnou?igsh=NGFjenFmZXN1Z2N3" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://www.tiktok.com/@glassnou" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <span className="sr-only">TikTok</span>
                  <TikTokIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Navegación */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-white uppercase tracking-wider">Servicios</p>
                <nav className="mt-4 flex flex-col space-y-2 text-sm">
                  <Link href="/cotiza" className="text-gray-400 hover:text-white transition-colors">Cotiza Aquí</Link>
                  <Link href="/servicios" className="text-gray-400 hover:text-white transition-colors">Catálogo</Link>
                </nav>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-white uppercase tracking-wider">Empresa</p>
                <nav className="mt-4 flex flex-col space-y-2 text-sm">
                  <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors">Contacto</Link>
                  <Link href="/preguntas-frecuentes" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
                  <Link href="/garantia" className="text-gray-400 hover:text-white transition-colors">Garantía</Link>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
                </nav>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-white uppercase tracking-wider">Contáctanos</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>
                    <a href="mailto:glassnou@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                      glassnou@gmail.com
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${PHONE}`} className="text-gray-400 hover:text-white transition-colors">
                      686 77 00 74
                    </a>
                  </li>
                  <li className="text-gray-400 leading-relaxed">
                    <a
                      href="https://maps.google.com/?q=GLASSNOU+Barcelona"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      Carrer Maria Barrientos, 23<br />
                      Les Corts · 08028 Barcelona
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-10 border-t border-gray-800/60 pt-8">
            <div className="flex flex-col items-center gap-4 mb-6">
              <img
                src="/images/glass-talleres-logo.png"
                alt="Logo glass talleres - Red de talleres especializados"
                className="h-14 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
              <p className="text-xs text-gray-500">Formamos parte de la red glass talleres</p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center text-xs text-gray-500 sm:flex-row sm:justify-between">
              <p>&copy; {new Date().getFullYear()} glassnou online. Todos los derechos reservados.</p>
              <Link href="/proteccion-datos" className="hover:text-white transition-colors">
                Protección de Datos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

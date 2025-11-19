import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <Link 
          href="/cotiza" 
          className="block max-w-3xl mx-auto transition-transform hover:scale-[1.02] duration-300"
        >
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
            {/* Imagen de la promoción */}
            <Image
              src="/images/promo-baliza.jpg"
              alt="Promoción especial GlassNou - Baliza de emergencia OSRAM homologada DGT 2026 por solo 25€ al cambiar o reparar tu parabrisas. Precio sin promoción 54,45€. Incluye batería y soporte magnético"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
            
            {/* Overlay con botón CTA (opcional) */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-white text-center sm:text-left">
                  <p className="text-base md:text-lg font-bold mb-1">
                    ¡Aprovecha esta oferta exclusiva!
                  </p>
                  <p className="text-xs md:text-sm text-gray-200">
                    Baliza de emergencia por solo 25€ al cambiar tu parabrisas
                  </p>
                </div>
                <Button 
                  size="default" 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold whitespace-nowrap text-sm"
                >
                  Solicitar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

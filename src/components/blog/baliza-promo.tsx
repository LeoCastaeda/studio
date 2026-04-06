import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BalizaPromo() {
  return (
    <section className="py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20 border-y border-amber-200 dark:border-amber-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-amber-200 dark:border-amber-900">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative h-64 md:h-auto">
                <Image
                  src="/images/promo-baliza.jpg"
                  alt="Baliza de emergencia DGT 2026 homologada"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    OBLIGATORIA 2026
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="mb-6">
                  <div className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full text-xs font-semibold mb-4">
                    OFERTA ESPECIAL
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                    Baliza V-16 Homologada DGT
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    Obligatoria desde 2026. Sustituye a los triángulos de emergencia. Homologada y certificada.
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {[
                    'Homologada DGT 2026',
                    'Luz LED visible a 1km',
                    'Batería de larga duración',
                    'Resistente al agua (IP54)',
                    'Instalación en 1 minuto',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price and CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      Antes: 29,99€
                    </div>
                    <div className="text-4xl font-extrabold text-red-600 dark:text-red-500">
                      19,99€
                    </div>
                  </div>
                  <Button 
                    asChild
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Link href="/productos/baliza-emergencia" className="flex items-center gap-2">
                      Comprar ahora
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Envío gratis • Garantía 2 años • Stock disponible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

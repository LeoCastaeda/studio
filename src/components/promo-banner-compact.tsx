import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';

export function PromoBannerCompact() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-yellow-300 flex-shrink-0" />
            <div>
              <div className="font-bold text-lg">
                ¡Promoción Especial! Baliza de Emergencia por solo 25€
              </div>
              <div className="text-sm text-red-100">
                Al cambiar o reparar tu parabrisas con nosotros
              </div>
            </div>
          </div>
          <Button 
            size="lg" 
            className="bg-white text-red-600 hover:bg-red-50 font-bold whitespace-nowrap"
            asChild
          >
            <Link href="/cotiza">
              Solicitar Ahora <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

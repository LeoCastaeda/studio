import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-red-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/10">
      {/* Imagen */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
        <Image
          src={product.image.url}
          alt={`Servicio de ${product.name} - Instalación y reparación profesional en Barcelona`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-ai-hint={product.image.hint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">
          {product.description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <Link
          href={`/servicios/${product.id}`}
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          Ver detalles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

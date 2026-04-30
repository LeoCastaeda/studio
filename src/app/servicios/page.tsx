"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { GlassGuide } from "@/components/glass-guide";
import { Input } from "@/components/ui/input";
import { Search, Phone, MessageCircle, Wrench } from "lucide-react";
import Link from "next/link";

const PHONE = "+34686770074";
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hola, quiero información sobre vuestros servicios de cristales.")}`;

function ProductsFallback() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-800" />
        ))}
      </div>
    </div>
  );
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const debouncedQ = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQ) params.set("q", debouncedQ);
    else params.delete("q");
    params.delete("focus");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, pathname, router]);

  const filteredProducts = useMemo(() => {
    const q = debouncedQ.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [debouncedQ]);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Guía 3D */}
      <div className="mb-12">
        <GlassGuide />
      </div>

      {/* Buscador */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            type="search"
            aria-label="Buscar servicios"
            placeholder="Buscar servicios..."
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-400">
            No se encontraron servicios para &quot;{searchTerm}&quot;.
          </p>
        </div>
      )}

      {/* CTA presupuesto */}
      <div className="mt-16 bg-gray-900 border border-gray-800 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
          ¿No encuentras lo que buscas?
        </h2>
        <p className="text-gray-400 mb-6">
          Cuéntanos tu caso y te damos precio en menos de 10 minutos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${PHONE}`}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Phone className="h-4 w-4" /> +34 686 770 074
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <Link
            href="/cotiza"
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl transition-colors border border-gray-700"
          >
            <Wrench className="h-4 w-4" /> Solicitar presupuesto
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero con video de fondo */}
      <section className="relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%] md:object-center"
          aria-hidden="true"
        >
          <source src="/video/video_blog.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent" aria-hidden="true" />

        <div className="relative z-10 container mx-auto text-center max-w-3xl py-20 px-4 pb-28">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Nuestros servicios
          </h1>
          <p className="text-gray-200 text-lg drop-shadow">
            Reparación y sustitución de cristales de automoción en Barcelona.
            Calidad OEM con garantía de por vida.
          </p>
        </div>
      </section>



      <Suspense fallback={<ProductsFallback />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}

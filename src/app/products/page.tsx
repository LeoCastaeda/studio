"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// --- Fallback (skeleton) mientras resuelve useSearchParams ---
function ProductsFallback() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Nuestros Servicios</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Cargando…
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

// --- Hook de debounce simple ---
function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// --- Contenido real que usa useSearchParams (debe ir dentro de Suspense) ---
function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Inicializa desde ?q=
  const initialQ = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const debouncedQ = useDebouncedValue(searchTerm, 300);

  // Sincroniza ?q= en la URL (evita parámetros basura como focus)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQ) params.set("q", debouncedQ);
    else params.delete("q");
    params.delete("focus");

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, pathname, router]);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Nuestros Servicios</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Encuentre el servicio de reemplazo de cristal adecuado para su vehículo en nuestra extensa colección de productos de alta calidad.
        </p>
      </div>

      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Buscar servicios"
            placeholder="Buscar servicios..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No se encontraron servicios para &quot;{searchTerm}&quot;.
          </p>
        </div>
      )}
    </div>
  );
}

// --- Página: envuelve el contenido con Suspense ---
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsContent />
    </Suspense>
  );
}

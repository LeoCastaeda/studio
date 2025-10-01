"use client";

import { useState } from "react";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <p className="text-lg text-muted-foreground">No se encontraron servicios para "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car, Wrench, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-3xl p-4">
          <h1 className="text-4xl font-headline font-bold md:text-6xl drop-shadow-lg">
            Visión Clara para el Camino por Delante
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-200 drop-shadow-md">
            Encuentra el cristal perfecto y de alta calidad para tu vehículo con GlassNou. Rápido, confiable y preciso.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/finder">
                Encuentra tu Cristal <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">Ver Productos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto py-16 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-headline font-bold">¿Por Qué Elegir GlassNou?</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos una experiencia sin complicaciones para todas tus necesidades de cristales para auto, desde encontrar la pieza correcta hasta obtener una cotización.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader className="items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <Wrench className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">Buscador de Cristales con IA</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Nuestra herramienta inteligente te ayuda a encontrar el cristal exacto para el año, marca y modelo de tu vehículo en segundos.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <Car className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">Catálogo Extenso</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Navega por una amplia selección de parabrisas, ventanas y espejos de calidad OEM para todas las marcas principales.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">Garantía y Calidad</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Compra con confianza sabiendo que nuestros productos están respaldados por una garantía completa y garantía de calidad.
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="featured-products" className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-headline font-bold">Productos Destacados</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Echa un vistazo a algunos de nuestros productos de cristales para auto más populares.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/products">Ver Todos los Productos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

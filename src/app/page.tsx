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
            Crystal Clear Vision for the Road Ahead
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-200 drop-shadow-md">
            Find the perfect, high-quality glass for your vehicle with GlassNou. Fast, reliable, and precise.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/finder">
                Find Your Glass <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto py-16 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-headline font-bold">Why Choose GlassNou?</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            We provide a seamless experience for all your auto glass needs, from finding the right part to getting a quote.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader className="items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <Wrench className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">AI-Powered Glass Finder</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Our intelligent tool helps you find the exact glass for your vehicle's year, make, and model in seconds.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <Car className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">Extensive Catalog</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Browse a wide selection of OEM-quality windshields, windows, and mirrors for all major brands.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">Warranty & Quality</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Shop with confidence knowing our products are backed by a comprehensive warranty and quality guarantee.
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="featured-products" className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-headline font-bold">Featured Products</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Check out some of our most popular auto glass products.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

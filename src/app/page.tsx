"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car, Wrench, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { ReviewCard } from "@/components/review-card";
import { products, reviews } from "@/lib/data";
import { Logo } from "@/components/logo"; // ← IMPORTA TU LOGO

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/images/hero-background.png"
          alt="Taller especializado en reparación e instalación de cristales y parabrisas para automóviles en Barcelona - GlassNou"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Contenido overlay */}
        <div className="relative z-10 max-w-3xl p-4">
          {/* LOGO ENCIMA DEL TÍTULO */}
          <Logo
  aria-label="GlassNou"
  className="mx-auto -mt-6 md:-mt-10 mb-2 h-64 w-auto text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
/>
          <h1 className="text-4xl font-headline font-bold md:text-6xl drop-shadow-lg">
            Expertos en Cristales para Autos
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-200 drop-shadow-md">
            Servicio profesional de venta e instalación de cristales para todo tipo de vehículos. Calidad y seguridad garantizada.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/quote">
                Cotiza Aquí <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">Nuestros Servicios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section id="features" className="container mx-auto py-16 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-headline font-bold">¿Por Qué Elegir GlassNou?</h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader className="items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <Wrench className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">Servicio Profesional</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Nuestro equipo de expertos garantiza una instalación precisa y segura, devolviendo la integridad a tu vehículo.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <Car className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">Amplia Compatibilidad</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Contamos con un extenso catálogo de cristales para todas las marcas y modelos de autos, camionetas y SUVs.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">Calidad Garantizada</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Utilizamos solo cristales que cumplen con las especificaciones del fabricante original (OEM) para tu seguridad.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SERVICIOS DESTACADOS */}
      <section id="featured-products" className="bg-card py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-headline font-bold">Nuestros Servicios Principales</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Estos son algunos de los servicios más solicitados por nuestros clientes.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/products">Ver Todos los Servicios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* RESEÑAS */}
      <section id="reviews" className="container mx-auto py-16 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-headline font-bold">Lo que dicen nuestros clientes</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Nos enorgullece ofrecer un servicio excepcional. Esto es lo que algunos de nuestros clientes satisfechos han compartido.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  );
}

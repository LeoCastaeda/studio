import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { CheckCircle, Clock, Phone, MessageCircle, ArrowLeft, Tag } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return {};
  return {
    title: `${product.name} | Glassnou Barcelona`,
    description: product.description,
  };
}

const PHONE = "+34686770074";
const PHONE_DISPLAY = "+34 686 770 074";

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Breadcrumb */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a servicios
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12">

        {/* Hero card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-8">
          <div className="grid md:grid-cols-2">

            {/* Imagen */}
            <div className="relative aspect-video md:aspect-auto md:min-h-[320px] overflow-hidden bg-gray-800">
              <Image
                src={product.image.url}
                alt={`${product.name} - Servicio profesional en Barcelona por GlassNou`}
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
                data-ai-hint={product.image.hint}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/30" />
            </div>

            {/* Info */}
            <div className="flex flex-col p-8">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                {product.name}
              </h1>
              <p className="text-gray-400 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Disponibilidad */}
              <div className="flex items-center gap-4 text-sm mb-8">
                <span className="flex items-center gap-1.5 text-green-400 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Disponible hoy
                </span>
                {product.specifications["Tiempo estimado"] && (
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="h-4 w-4" />
                    {product.specifications["Tiempo estimado"]}
                  </span>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 mt-auto">
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Llamar: {PHONE_DISPLAY}
                </a>
                <a
                  href={`https://wa.me/${PHONE}?text=${encodeURIComponent(`Hola, me interesa el servicio: ${product.name}. ¿Podéis darme un presupuesto?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Pedir presupuesto por WhatsApp
                </a>
                <Link
                  href={`/cotiza?glassType=${encodeURIComponent(product.name)}`}
                  className="flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Solicitar cotización online
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Especificaciones + Compatibilidad */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Especificaciones */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5">Especificaciones</h2>
            <ul className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key} className="flex justify-between items-start gap-4 text-sm border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                  <span className="text-gray-400 shrink-0">{key}</span>
                  <span className="text-white font-medium text-right">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compatibilidad */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5">Compatibilidad del vehículo</h2>
            <div className="flex flex-wrap gap-2">
              {product.compatibility.map((model) => (
                <span
                  key={model}
                  className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 text-gray-300 text-sm px-3 py-1.5 rounded-full"
                >
                  <Tag className="h-3 w-3 text-red-400" />
                  {model}
                </span>
              ))}
            </div>

            {/* CTA extra */}
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <p className="text-gray-400 text-sm mb-3">
                ¿No encuentras tu vehículo? Consúltanos directamente.
              </p>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold text-sm transition-colors"
              >
                <Phone className="h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

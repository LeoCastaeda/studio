import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Truck } from "lucide-react";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl py-12">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video w-full">
            <Image
              src={product.image.url}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.image.hint}
            />
          </div>
          <div className="flex flex-col p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-headline md:text-3xl">
                {product.name}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 mt-6">
              <div className="space-y-4">
                <div className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>En Stock</span>
                    <Separator orientation="vertical" className="h-4 mx-2" />
                    <Truck className="h-4 w-4 mr-2 text-primary" />
                    <span>Se envía en 24 horas</span>
                </div>
              </div>

              <div className="mt-6">
                <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90">
                    <Link href={`/quote?glassType=${encodeURIComponent(product.name)}`}>Solicitar Cotización de Instalación</Link>
                </Button>
              </div>

            </CardContent>
          </div>
        </div>
        <div className="p-6 border-t">
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <h3 className="text-lg font-semibold font-headline mb-4">Especificaciones</h3>
                    <ul className="space-y-2 text-sm text-card-foreground">
                        {Object.entries(product.specifications).map(([key, value]) => (
                            <li key={key} className="flex justify-between">
                                <span className="text-muted-foreground">{key}</span>
                                <span className="font-medium text-right">{value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold font-headline mb-4">Compatibilidad del Vehículo</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.compatibility.map((model) => (
                            <Badge key={model} variant="secondary">{model}</Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
}

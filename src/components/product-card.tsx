import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={product.image.url}
            alt={`Servicio de ${product.name} - Instalación y reparación profesional en Barcelona`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={product.image.hint}
          />
        </div>
      </CardHeader>
      <div className="flex flex-1 flex-col p-6">
        <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
        <CardDescription className="mt-2 text-sm line-clamp-3 flex-1">
          {product.description}
        </CardDescription>
        <div className="mt-4 text-2xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </div>
      </div>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/products/${product.id}`}>
            Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

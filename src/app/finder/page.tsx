import Link from "next/link";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function FinderPage() {
  const carImage = PlaceHolderImages.find(p => p.id === 'interactive-car');

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-headline">Buscador Visual de Cristales</CardTitle>
              <CardDescription>
                Utiliza nuestro modelo interactivo para seleccionar la pieza de cristal que necesitas. Simplemente haz clic en el cristal del vehículo para empezar.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">
                    Este innovador sistema te permite identificar visualmente la pieza exacta, asegurando que obtengas una cotización precisa para el cristal correcto de tu vehículo.
                </p>
              <Button asChild size="lg" className="w-full">
                <Link href="/selector">
                  Iniciar Buscador Visual <MoveRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="order-1 md:order-2">
            {carImage && (
                <Image
                    src={carImage.imageUrl}
                    alt={carImage.description}
                    width={600}
                    height={400}
                    className="rounded-lg object-cover shadow-2xl"
                    data-ai-hint={carImage.imageHint}
                />
            )}
        </div>
      </div>
    </div>
  );
}

    
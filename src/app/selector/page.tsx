"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

type GlassPart =
  | "front-windshield"
  | "rear-windshield"
  | "driver-side-window"
  | "passenger-side-window"
  | "driver-rear-window"
  | "passenger-rear-window"
  | "sunroof";

const glassParts: { id: GlassPart; label: string; path: string }[] = [
  { id: "front-windshield", label: "Parabrisas Delantero", path: "M 300,150 L 380,125 L 480,125 L 500,150 Z" },
  { id: "rear-windshield", label: "Luneta Trasera", path: "M 680,150 L 700,125 L 780,125 L 750,150 Z" },
  { id: "driver-side-window", label: "Ventana del Conductor", path: "M 505,150 L 485,125 L 580,125 L 580,150 Z" },
  { id: "passenger-side-window", label: "Ventana del Pasajero", path: "M 585,150 L 585,125 L 675,125 L 675,150 Z" },
  { id: "sunroof", label: "Techo Solar", path: "M 510,124 L 660,124 L 660,118 L 510,118 Z" },
];

export default function SelectorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSelection = searchParams.get('glassType') as GlassPart | null;
  const [selectedPart, setSelectedPart] = useState<GlassPart | null>(initialSelection);

  const carImage = PlaceHolderImages.find((p) => p.id === "interactive-car");

  const handlePartClick = (part: GlassPart) => {
    setSelectedPart(part);
  };

  const handleNext = () => {
    if (selectedPart) {
      router.push(`/quote?glassType=${selectedPart}`);
    }
  };
  
  const handleBack = () => {
      router.back();
  }

  const selectedLabel = glassParts.find(p => p.id === selectedPart)?.label;

  return (
    <div className="container mx-auto py-12 px-4">
       <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4"/>
            Volver
       </Button>
      <Card className="overflow-hidden">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Selector de Cristales Interactivo</CardTitle>
            <CardDescription>Haz clic en una parte de cristal del vehículo para seleccionarla.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative w-full max-w-4xl mx-auto aspect-[4/2]">
              {carImage && (
                <Image
                  src={carImage.imageUrl}
                  alt={carImage.description}
                  fill
                  className="object-contain"
                  data-ai-hint={carImage.imageHint}
                />
              )}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1000 500"
              >
                {glassParts.map((part) => (
                  <path
                    key={part.id}
                    d={part.path}
                    className={cn(
                      "fill-cyan-400/20 stroke-cyan-400 stroke-2 transition-all duration-300 cursor-pointer",
                      "hover:fill-cyan-400/50",
                      selectedPart === part.id ? "fill-cyan-400/70" : ""
                    )}
                    onClick={() => handlePartClick(part.id)}
                  />
                ))}
              </svg>
            </div>

            <div className="mt-8 text-center">
                <p className="text-lg mb-4">
                    <span className="text-muted-foreground">Seleccionado: </span>
                    <span className="font-bold text-primary">{selectedLabel || 'Ninguno'}</span>
                </p>
                <Button onClick={handleNext} disabled={!selectedPart} size="lg">
                    Continuar con la Cotización
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
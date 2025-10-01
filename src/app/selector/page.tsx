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
  | "passenger-rear-window";

const glassParts: { id: GlassPart; label: string; path: string }[] = [
  { id: "front-windshield", label: "Parabrisas Delantero", path: "M 275,254 L 468,172 L 592,172 L 720,254 Z" },
  { id: "rear-windshield", label: "Luneta Trasera", path: "M 1020,260 L 1125,188 L 1210,192 L 1278,260 Z" },
  { id: "driver-side-window", label: "Ventana del Conductor", path: "M 725,255 L 600,174 L 702,175 L 811,255 Z" },
  { id: "passenger-side-window", label: "Ventana del Pasajero", path: "M 822,255 L 712,175 L 820,175 L 900,255 Z" },
  { id: "driver-rear-window", label: "Ventana Trasera Izquierda", path: "M 910,256 L 830,176 L 980,183 L 1010,256 Z" },
  { id: "passenger-rear-window", label: "Ventana Trasera Derecha", path: "M 1015,258 L 988,184 L 1115,188 L 1115,258 Z" },
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
            <div className="relative w-full max-w-5xl mx-auto aspect-[1500/665]">
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
                viewBox="0 0 1500 665"
              >
                {glassParts.map((part) => (
                  <path
                    key={part.id}
                    d={part.path}
                    className={cn(
                      "fill-red-500/20 stroke-red-500 stroke-2 transition-all duration-300 cursor-pointer",
                      "hover:fill-red-500/50",
                      selectedPart === part.id ? "fill-red-500/70" : ""
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

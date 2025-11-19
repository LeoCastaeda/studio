"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Wind, Sun, Droplets } from "lucide-react";
import { Model3DViewer } from "@/components/model-3d-viewer";

export function GlassGuide() {
  const [activeTab, setActiveTab] = useState("parabrisas");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Guía de Cristales de Automoción</CardTitle>
        <CardDescription>
          Conozca los diferentes tipos de cristales y sus características. Interactúa con el modelo 3D.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Modelo 3D */}
        <div className="mb-8">
          <Model3DViewer modelPath="/images/3D_model/car.glb" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Usa el ratón para rotar y explorar el modelo 3D
          </p>
        </div>

        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="parabrisas">Parabrisas</TabsTrigger>
            <TabsTrigger value="laterales">Laterales</TabsTrigger>
            <TabsTrigger value="trasero">Trasero</TabsTrigger>
            <TabsTrigger value="techo">Techo Solar</TabsTrigger>
          </TabsList>

          <TabsContent value="parabrisas" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Cristal Laminado</h3>
                  <p className="text-sm text-muted-foreground">
                    Dos capas de vidrio con una lámina de plástico intermedia que evita que se rompa en pedazos peligrosos.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Sun className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Protección UV</h3>
                  <p className="text-sm text-muted-foreground">
                    Bloquea hasta el 99% de los rayos UV dañinos, protegiendo el interior del vehículo y a los ocupantes.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Wind className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Aislamiento Acústico</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduce significativamente el ruido exterior para una conducción más confortable.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Droplets className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Sensor de Lluvia</h3>
                  <p className="text-sm text-muted-foreground">
                    Compatible con sistemas de detección automática de lluvia en vehículos modernos.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="laterales" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Cristal Templado</h3>
                  <p className="text-sm text-muted-foreground">
                    Tratado térmicamente para mayor resistencia. Se rompe en pequeños fragmentos sin bordes afilados.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Sun className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Tintado</h3>
                  <p className="text-sm text-muted-foreground">
                    Opciones de tintado para mayor privacidad y reducción del calor interior.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Wind className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Ajuste Perfecto</h3>
                  <p className="text-sm text-muted-foreground">
                    Diseñados específicamente para cada modelo de vehículo garantizando un sellado hermético.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Droplets className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Repelente al Agua</h3>
                  <p className="text-sm text-muted-foreground">
                    Tratamiento opcional que facilita la visibilidad en condiciones de lluvia.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trasero" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Cristal Templado</h3>
                  <p className="text-sm text-muted-foreground">
                    Mayor resistencia a impactos y cambios de temperatura. Seguridad garantizada.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Sun className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Desempañador</h3>
                  <p className="text-sm text-muted-foreground">
                    Líneas de calefacción integradas para eliminar rápidamente el vaho y la escarcha.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Wind className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Antena Integrada</h3>
                  <p className="text-sm text-muted-foreground">
                    Compatible con sistemas de radio y GPS integrados en el cristal.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Droplets className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Cámara Trasera</h3>
                  <p className="text-sm text-muted-foreground">
                    Preparado para la instalación de cámaras de visión trasera y sistemas de asistencia.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="techo" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex gap-3">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Cristal Laminado</h3>
                  <p className="text-sm text-muted-foreground">
                    Doble capa de seguridad que previene la entrada de objetos en caso de rotura.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Sun className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Control Solar</h3>
                  <p className="text-sm text-muted-foreground">
                    Filtros especiales que reducen el calor y el deslumbramiento manteniendo la luminosidad.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Wind className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Mecanismo Deslizante</h3>
                  <p className="text-sm text-muted-foreground">
                    Compatible con sistemas de apertura manual y eléctrica según el modelo.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Droplets className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Sellado Hermético</h3>
                  <p className="text-sm text-muted-foreground">
                    Juntas de alta calidad que previenen filtraciones de agua y aire.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

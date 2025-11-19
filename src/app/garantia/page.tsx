import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function WarrantyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
                <ShieldCheck className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-headline font-bold">Información de Garantía</h1>
            <p className="mt-2 text-muted-foreground">
                Tu tranquilidad es nuestra prioridad. Así es como respaldamos nuestros productos y servicios.
            </p>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Garantía de por Vida en la Mano de Obra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                        GlassNou Online garantiza la instalación de tu nuevo cristal de auto mientras seas dueño de tu vehículo.
                        Esta garantía cubre cualquier problema relacionado con la mano de obra de la instalación, incluyendo filtraciones de agua, ruido de viento
                        y molduras o sellos sueltos.
                    </p>
                    <p>
                        Si experimentas alguno de estos problemas, simplemente contáctanos para programar una inspección y reparación sin costo.
                        Esta garantía no es transferible y se aplica solo al vehículo para el cual se realizó el servicio.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Garantía por Defectos del Fabricante</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                        Todos los productos de cristal que vendemos están cubiertos por una garantía del fabricante por un período de un (1) año a partir de la fecha de instalación.
                        Esta garantía cubre defectos en el cristal, como distorsión, delaminación u otros defectos de fabricación.
                    </p>
                    <p>
                        No cubre daños por factores externos, incluyendo, entre otros, impactos de piedras, grietas por impacto, vandalismo
                        o grietas por tensión resultantes de accidentes o flexión de la carrocería del vehículo.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Exclusiones y Limitaciones de la Garantía</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                        Nuestra garantía no cubre daños o fallas resultantes de:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Impacto, accidentes, vandalismo o cualquier forma de daño externo.</li>
                        <li>Óxido o daño preexistente en el marco o carrocería del vehículo donde se instala el cristal.</li>
                        <li>Mantenimiento inadecuado, incluido el uso de productos químicos agresivos o materiales abrasivos en el cristal.</li>
                        <li>Cualquier modificación o alteración realizada en el vehículo o el cristal después de nuestra instalación.</li>
                    </ul>
                     <p>
                        Para hacer un reclamo de garantía, se requiere un comprobante de compra y servicio de GlassNou Online. Nos reservamos el derecho de inspeccionar el vehículo
                        y el daño antes de aprobar cualquier servicio de garantía.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

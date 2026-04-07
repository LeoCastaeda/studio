import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

const insuranceCompanies = [
  { name: "Mapfre", logo: "/images/insurance/mapfre.svg" },
  { name: "Mutua Madrileña", logo: "/images/insurance/mutua-madrilena.svg" },
  { name: "Allianz", logo: "/images/insurance/allianz.svg" },
  { name: "AXA", logo: "/images/insurance/axa.svg" },
  { name: "Generali", logo: "/images/insurance/generali.svg" },
  { name: "Zurich", logo: "/images/insurance/zurich.svg" },
  { name: "Liberty Seguro", logo: "/images/insurance/liberty.svg" },
  { name: "Línea Directa", logo: "/images/insurance/linea-directa.svg" },
  { name: "Catalana Occidente", logo: "/images/insurance/Catalana-Occidente.svg" },
  { name: "Pelayo", logo: "/images/insurance/pelayo.svg" },
];

export function InsurancePartners() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-headline font-bold mb-4">
            Trabajamos con Todas las Aseguradoras
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nos ocupamos de todo: trabajamos con todas las aseguradoras y gestionamos los trámites por ti.
          </p>
        </div>

        <Card className="p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-items-center">
            {insuranceCompanies.map((company) => (
              <div
                key={company.name}
                className="flex items-center justify-center px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-w-[120px] h-[80px] relative"
                title={company.name}
              >
                <Image
                  src={company.logo}
                  alt={`Logo de ${company.name}`}
                  width={100}
                  height={60}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Y muchas más... Trabajamos con todas las compañías de seguros del mercado
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

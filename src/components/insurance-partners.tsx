import Image from "next/image";
import { Shield } from "lucide-react";

const insuranceCompanies = [
  { name: "Mapfre",              logo: "/images/insurance/mapfre.svg" },
  { name: "Mutua Madrileña",     logo: "/images/insurance/mutua-madrilena.svg" },
  { name: "Allianz",             logo: "/images/insurance/allianz.svg" },
  { name: "AXA",                 logo: "/images/insurance/axa.svg" },
  { name: "Generali",            logo: "/images/insurance/generali.svg" },
  { name: "Zurich",              logo: "/images/insurance/zurich.svg" },
  { name: "Liberty Seguro",      logo: "/images/insurance/liberty.svg" },
  { name: "Línea Directa",       logo: "/images/insurance/linea-directa.svg" },
  { name: "Catalana Occidente",  logo: "/images/insurance/Catalana-Occidente.svg" },
  { name: "Pelayo",              logo: "/images/insurance/pelayo.svg" },
];

export function InsurancePartners() {
  return (
    <section className="py-16 bg-gray-950 border-y border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-600/20 border border-red-600/30 mb-4">
            <Shield className="h-7 w-7 text-red-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Trabajamos con todas las aseguradoras
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Gestionamos tu siniestro directamente con tu compañía de seguros, sin costes adicionales y sin complicaciones.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {insuranceCompanies.map((company) => (
            <div
              key={company.name}
              title={company.name}
              className="flex items-center justify-center p-5 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-600 transition-colors group"
            >
              <div className="relative w-full h-10 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300">
                <Image
                  src={company.logo}
                  alt={`Logo de ${company.name}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Y muchas más · Trabajamos con todas las compañías del mercado
        </p>
      </div>
    </section>
  );
}

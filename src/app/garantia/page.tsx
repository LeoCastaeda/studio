import { Shield, CheckCircle, Phone, MessageCircle, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garantía | Glassnou Barcelona",
  description:
    "Garantía de por vida en la instalación de cristales de automoción. Glassnou Barcelona te cubre mientras seas propietario del vehículo.",
};

const PHONE = "+34686770074";
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hola, quiero información sobre la garantía de mi cristal.")}`;

const GUARANTEES = [
  {
    icon: <Shield className="h-7 w-7 text-green-400" />,
    title: "Garantía de por vida en la instalación",
    items: [
      "Cubre filtraciones de agua y ruido de viento",
      "Molduras o sellos sueltos incluidos",
      "Válida mientras seas propietario del vehículo",
      "Sin coste en caso de defecto de instalación",
    ],
  },
  {
    icon: <CheckCircle className="h-7 w-7 text-blue-400" />,
    title: "Garantía del fabricante (1 año)",
    items: [
      "Cubre defectos en el cristal: distorsión, delaminación",
      "1 año desde la fecha de instalación",
      "Cristales de calidad OEM certificada",
      "Aplicable a todos los vehículos",
    ],
  },
  {
    icon: <AlertCircle className="h-7 w-7 text-yellow-400" />,
    title: "Exclusiones de la garantía",
    items: [
      "Impactos, accidentes o vandalismo externo",
      "Óxido o daño preexistente en el marco",
      "Uso de productos químicos agresivos",
      "Modificaciones tras nuestra instalación",
    ],
    isExclusion: true,
  },
];

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero con video */}
      <section className="relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden="true"
        >
          <source src="/video/video_blog.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent" aria-hidden="true" />

        <div className="relative z-10 container mx-auto max-w-3xl text-center py-16 px-4">
          <div className="inline-flex items-center justify-center bg-green-600/20 border border-green-600/30 rounded-full p-4 mb-6 backdrop-blur-sm">
            <Shield className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Garantía total en cada trabajo
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto drop-shadow">
            En Glassnou respaldamos cada instalación con garantía de por vida. Si hay algún problema con nuestra mano de obra, lo solucionamos sin coste.
          </p>
        </div>
      </section>


      {/* Garantías */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          {GUARANTEES.map((g) => (
            <div
              key={g.title}
              className={`bg-gray-900 border rounded-2xl p-8 ${g.isExclusion ? "border-yellow-800/40" : "border-gray-800"}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-800 rounded-xl">{g.icon}</div>
                <h2 className="text-xl font-bold text-white">{g.title}</h2>
              </div>
              <ul className="space-y-3">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300">
                    <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${g.isExclusion ? "bg-yellow-500" : "bg-green-500"}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA */}
          <div className="bg-gradient-to-br from-red-900/30 to-gray-900 border border-red-800/30 rounded-2xl p-8 text-center mt-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              ¿Tienes algún problema con tu instalación?
            </h2>
            <p className="text-gray-400 mb-6">
              Contacta con nosotros y lo gestionamos de inmediato, sin burocracia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:${PHONE}`}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                <Phone className="h-4 w-4" /> +34 686 770 074
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

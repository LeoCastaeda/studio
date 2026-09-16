import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Users, Lightbulb, Shield, Award, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nosotros | Glassnou - Más de 15 años de experiencia",
  description: "Conoce a Glassnou, empresa del grupo Glass Talleres con más de 15 años de experiencia y +5.000 lunas instaladas en Barcelona. Valoración 4.9★ en Google.",
  openGraph: {
    title: "Sobre Nosotros | Glassnou Barcelona",
    description: "Más de 15 años de experiencia en el sector del vidrio automotriz. Concertados con la mayoría de aseguradoras.",
  },
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/images/logo_glasnou_clean.png"
                alt="Glassnou - Cristales de coche"
                width={300}
                height={100}
                priority
                className="h-20 md:h-24 w-auto"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Bienvenidos a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                glassnou
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Somos un equipo con más de 15 años de experiencia en el sector del vidrio.
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Estamos comprometidos con la excelencia y la calidad en todo lo que hacemos.
            </p>
          </div>
        </div>
      </section>

      {/* ¿Quiénes Somos? */}
      <section className="py-16 md:py-24 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 border border-red-600/30 mb-6">
                <Users className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                ¿Quiénes somos?
              </h2>
            </div>

            <div className="bg-gray-900 rounded-3xl p-8 md:p-12 border border-gray-800 space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                <span className="font-bold text-white">glassnou</span> es una empresa que pertenece al grupo{" "}
                <span className="font-bold text-white">Glass Talleres</span>, con la cual trabajamos y que nos permite estar concertados con la mayoría de las compañías de seguros. Estamos ubicados en el distrito de{" "}
                <span className="font-bold text-white">Les Corts en Barcelona</span>, pero disponemos de servicio a domicilio gratuito.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                En glassnou, nos encargamos de mantener en perfectas condiciones y reparar cualquier luna de vehículos, trabajando en la{" "}
                <span className="text-red-400 font-semibold">sustitución y reparación de todo tipo de lunas</span> de cualquier automóvil con la máxima garantía de calidad y rapidez.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-800">
                {[
                  { icon: Award, label: "+15 años", desc: "de experiencia" },
                  { icon: Shield, label: "+5.000", desc: "lunas instaladas" },
                  { icon: CheckCircle, label: "100%", desc: "garantía de instalación" },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/10 border border-red-600/20 mb-3">
                      <item.icon className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="font-bold text-2xl text-white">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                ))}
              </div>
              
              {/* Valoración Google */}
              <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                <div className="inline-flex items-center gap-2 text-yellow-400 mb-2">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold text-xl text-white">4.9</span>
                  <span className="text-gray-400">valoración media Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovación */}
      <section className="py-16 md:py-24 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Contenido */}
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 border border-blue-600/30 mb-6">
                  <Lightbulb className="h-8 w-8 text-blue-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                  Innovación
                </h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    En nuestra empresa, la <span className="text-white font-semibold">innovación es un pilar fundamental</span>. Nos esforzamos constantemente por encontrar nuevas y mejores formas de satisfacer las necesidades de nuestros clientes en el campo de la calibración de sistemas ADAS.
                  </p>
                  <p>
                    Desde la implementación de <span className="text-blue-400 font-semibold">tecnologías de última generación</span> hasta el desarrollo de métodos más eficientes, nuestra apuesta por la innovación nos permite ofrecer un servicio profesional y de alta calidad.
                  </p>
                  <p>
                    Nos comprometemos a mantenerte a la vanguardia de los avances en tecnología automotriz, asegurando que tu vehículo esté equipado con los <span className="text-white font-semibold">sistemas de seguridad más avanzados</span> y bien calibrados.
                  </p>
                  <p className="text-lg font-medium text-white pt-4">
                    Con nosotros, puedes confiar en que tu vehículo estará preparado para enfrentar los desafíos del camino con total seguridad y eficacia.
                  </p>
                </div>
              </div>

              {/* Imagen/Visual */}
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-gray-800 flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <Lightbulb className="h-32 w-32 text-blue-400/30 mx-auto mb-6" />
                    <div className="space-y-4">
                      {[
                        "Calibración ADAS",
                        "Tecnología avanzada",
                        "Sistemas de seguridad",
                        "Innovación continua",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 justify-center text-white/80">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garantía y Desarrollo Sostenible */}
      <section className="py-16 md:py-24 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Garantía de por vida */}
            <div className="bg-gradient-to-br from-green-950/30 via-gray-900 to-gray-900 rounded-3xl p-8 md:p-12 border border-green-800/30">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20 border border-green-600/30">
                    <Shield className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                    Garantía de por vida en la instalación
                  </h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Todos nuestros trabajos incluyen <span className="text-white font-semibold">garantía total mientras seas propietario del vehículo</span>. Si hay cualquier problema con la instalación, lo solucionamos sin coste.
                  </p>
                </div>
              </div>
            </div>

            {/* Desarrollo Sostenible */}
            <div className="bg-gradient-to-br from-blue-950/30 via-gray-900 to-gray-900 rounded-3xl p-8 md:p-12 border border-blue-800/30">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 border border-blue-600/30">
                    <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                    Compromiso con el Desarrollo Sostenible
                  </h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    En glassnou, nuestra filosofía empresarial está basada en el <span className="text-white font-semibold">desarrollo sostenible</span>. Nos comprometemos a impulsar prácticas responsables que generen un impacto positivo en las personas, las comunidades y el medio ambiente. Creemos firmemente en la importancia de contribuir de manera significativa al bienestar global.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-red-950/30 via-gray-900 to-gray-950 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              ¿Necesitas nuestros servicios?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Contacta con nosotros y te atenderemos lo antes posible
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-500 text-white font-bold text-lg px-8 py-6 rounded-xl">
                <Link href="/contacto">
                  Contactar ahora
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white/20 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 rounded-xl">
                <a href="tel:+34686770074">
                  <Phone className="mr-2 h-5 w-5" />
                  686 77 00 74
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

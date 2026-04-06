import Image from 'next/image';

const insuranceLogos = [
  { name: 'Allianz', src: '/images/insurance/allianz.svg' },
  { name: 'AXA', src: '/images/insurance/axa.svg' },
  { name: 'Catalana Occidente', src: '/images/insurance/Catalana-Occidente.svg' },
  { name: 'Generali', src: '/images/insurance/generali.svg' },
  { name: 'Liberty', src: '/images/insurance/liberty.svg' },
  { name: 'Línea Directa', src: '/images/insurance/linea-directa.svg' },
  { name: 'MAPFRE', src: '/images/insurance/mapfre.svg' },
  { name: 'Mutua Madrileña', src: '/images/insurance/mutua-madrilena.svg' },
  { name: 'Pelayo', src: '/images/insurance/pelayo.svg' },
  { name: 'Zurich', src: '/images/insurance/zurich.svg' },
];

export function InsuranceLogos() {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-y border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Trabajamos con todas las aseguradoras
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Gestionamos tu siniestro directamente con tu compañía de seguros sin coste adicional
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
          {insuranceLogos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
            >
              <div className="relative w-full h-12 grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100">
                <Image
                  src={logo.src}
                  alt={`Logo ${logo.name}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Gestión directa con tu seguro • Sin costes adicionales</span>
          </div>
        </div>
      </div>
    </section>
  );
}

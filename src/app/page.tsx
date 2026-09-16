"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  Shield,
  Star,
  MapPin,
  ChevronRight,
  Zap,
  Award,
  Wrench,
  Car,
  ArrowRight,
} from "lucide-react";
import { InsurancePartners } from "@/components/insurance-partners";

const PHONE = "+34686770074";
const PHONE_DISPLAY = "+34 686 770 074";
const WHATSAPP_MSG = encodeURIComponent(
  "Hola, necesito un presupuesto para reparación/cambio de luna. ¿Me podéis ayudar?"
);
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${WHATSAPP_MSG}`;
const TEL_URL = `tel:${PHONE}`;

/* ─── CTA Fijos ───────────────────────────────────────────────── */
function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur-sm">
      <a
        href={TEL_URL}
        className="flex flex-1 items-center justify-center gap-2 py-4 bg-red-600 text-white font-bold text-base active:bg-red-700 transition-colors"
      >
        <Phone className="h-5 w-5" />
        Llamar ahora
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold text-base active:bg-green-700 transition-colors"
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp
      </a>
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[55svh] md:min-h-[70svh] flex items-center overflow-hidden bg-gray-950">
      {/* Video para Móvil (Optimizado) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover md:hidden opacity-60 scale-105"
      >
        <source src="/video/hero_mobile.mp4" type="video/mp4" />
      </video>

      {/* Video para Desktop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover hidden md:block opacity-60"
      >
        <source src="/video/hero_desktop.mp4" type="video/mp4" />
      </video>
      
      {/* Capas de gradiente para profundidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/40 to-gray-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/40 via-transparent to-gray-950/40" />

      <div className="relative z-10 w-full container mx-auto px-4 py-6 md:py-12 pb-20 md:pb-12">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Badge ubicación con glassmorphism */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-red-400 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-6 sm:mb-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Barcelona · Les Corts
          </div>

          {/* Headline con efecto de brillo en el texto rojo */}
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-black text-white leading-[1.1] sm:leading-[1.05] mb-6 sm:mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Cambio y reparación de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              lunas de automóvil
            </span>{" "}
            en el mismo día
          </h1>

          <p className="text-base sm:text-lg md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-400 px-2 sm:px-0">
            Especialistas en cristalería del automóvil. 
            <span className="block mt-2 font-normal text-white/90">Sin esperas, trabajamos con la mayoría de aseguradoras y garantía de por vida.</span>
          </p>

          {/* Badge de concertación */}
          <div className="mb-6 animate-in fade-in duration-1000 delay-500">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-xs sm:text-sm text-white/90 font-semibold">
              CONCERTADO CON EL 99% DE LAS ASEGURADORAS
            </span>
          </div>

          {/* Beneficios clave con mejor espaciado */}
          <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-10 mb-10 sm:mb-14 animate-in fade-in duration-1000 delay-600">
            {[
              "Reparación en 20 min",
              "Tramitamos con tu seguro",
              "Cristales homologados y certificados",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-white/90 font-semibold text-sm sm:text-base">
                <div className="bg-green-500/20 p-1 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                {b}
              </li>
            ))}
          </ul>

          {/* CTAs con efectos premium */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-800">
            <a
              href={TEL_URL}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-red-600 hover:bg-red-500 text-white font-black text-lg sm:text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(220,38,38,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-green-600 hover:bg-green-500 text-white font-black text-lg sm:text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(22,163,74,0.3)]"
            >
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              WhatsApp
            </a>
          </div>

          <div className="mt-8 sm:mt-10 flex items-center gap-3 sm:gap-4 text-gray-400 animate-in fade-in duration-1000 delay-1000">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-gray-950 bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm font-medium">
              +5,000 clientes satisfechos en Barcelona
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Servicios ───────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: <Car className="h-8 w-8 text-red-500" />,
    title: "Sustitución de parabrisas",
    desc: "Cambio completo con cristal OEM. Incluye calibración ADAS si tu coche lo necesita.",
    time: "~60 min",
  },
  {
    icon: <Wrench className="h-8 w-8 text-red-500" />,
    title: "Reparación de impactos",
    desc: "Astillas y grietas pequeñas reparadas en 20 min. Evitas el cambio completo.",
    time: "~20 min",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-red-500" />,
    title: "Lunas laterales",
    desc: "Sustitución de ventanillas laterales delanteras y traseras de todos los vehículos.",
    time: "~45 min",
  },
  {
    icon: <Shield className="h-8 w-8 text-red-500" />,
    title: "Luneta trasera",
    desc: "Cambio de luna trasera con desempañador integrado. Compatible con todos los modelos.",
    time: "~60 min",
  },
];

function Services() {
  return (
    <section id="servicios" className="py-16 md:py-24 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Nuestros servicios
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Reparamos y sustituimos todo tipo de cristales de vehículo con calidad garantizada.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group bg-gray-900 border border-gray-800 hover:border-red-600/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/10"
            >
              <div className="mb-4">{s.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
                <Clock className="h-3.5 w-3.5" />
                {s.time}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold transition-colors"
          >
            Ver todos los servicios <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Urgencia / Valor ────────────────────────────────────────── */
const VALUE_ITEMS = [
  {
    icon: <Zap className="h-7 w-7 text-yellow-400" />,
    title: "Mismo día",
    desc: "En la mayoría de casos tenemos stock y podemos atenderte el mismo día que llamas.",
  },
  {
    icon: <Shield className="h-7 w-7 text-blue-400" />,
    title: "Gestionamos tu seguro",
    desc: "Concertados con el 99% de aseguradoras. Nosotros hacemos los trámites, tú no te preocupas de nada.",
  },
  {
    icon: <Award className="h-7 w-7 text-green-400" />,
    title: "Sin costes ocultos",
    desc: "Presupuesto gratuito y sin compromiso. El precio que te decimos es el que pagas.",
  },
];

function Value() {
  return (
    <section className="py-16 md:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-red-600/20 text-red-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              ¿Por qué elegirnos?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Rápido, sin complicaciones y con seguro
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {VALUE_ITEMS.map((item) => (
              <div key={item.title} className="flex flex-col items-start gap-4 bg-gray-950 rounded-2xl p-6 border border-gray-800">
                <div className="p-3 bg-gray-900 rounded-xl">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Seguros ─────────────────────────────────────────────────── */
function InsuranceSection() {
  return (
    <section className="py-12 bg-gray-950 border-y border-gray-800">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-8">
          Concertados con el 99% de las aseguradoras
        </p>
        <InsurancePartners />
      </div>
    </section>
  );
}

/* ─── Confianza ───────────────────────────────────────────────── */
const TRUST_STATS = [
  { value: "+15 años", label: "de experiencia" },
  { value: "+5.000", label: "lunas instaladas" },
  { value: "100%", label: "garantía de instalación" },
  { value: "4.9★", label: "valoración media Google" },
];

function Trust() {
  return (
    <section className="py-16 md:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {TRUST_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-gray-900 border border-blue-800/30 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto text-center">
          <svg className="h-12 w-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Compromiso con el Desarrollo Sostenible
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto leading-relaxed">
            En glassnou, nuestra filosofía empresarial está basada en el desarrollo sostenible. Nos comprometemos a impulsar prácticas responsables que generen un impacto positivo en las personas, las comunidades y el medio ambiente. Creemos firmemente en la importancia de contribuir de manera significativa al bienestar global.
          </p>
          <a
            href="/nosotros"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-colors"
          >
            Conoce más sobre nosotros
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonios (Simplificado) ─────────────────────────────── */
function Reviews() {
  const GOOGLE_REVIEWS_URL = "https://www.google.es/maps/place/GLASSNOU+I+Taller+de+reparaci%C3%B3n,+sustituci%C3%B3n,+tintado+y+venta+de+lunas+de+coche+Barcelona/@41.3809496,2.1253225,17z/data=!4m8!3m7!1s0x12a49981ea0f2679:0x757434d486669db9!8m2!3d41.3809456!4d2.1278974!9m1!1b1!16s%2Fg%2F11sf716z8c";
  
  return (
    <section className="py-16 md:py-24 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="flex items-center gap-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-lg">
              <span className="font-bold text-white">4.9 de 5 estrellas</span>
              <span className="hidden sm:inline text-gray-500">•</span>
              <span className="text-gray-400">Basado en 152+ reseñas verificadas</span>
            </div>
            <a 
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.012,36.494,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Ver todas las reseñas en Google
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              name: "Cliente Verificado",
              text: "Servicio impecable. Me cambiaron el parabrisas en 1 hora y se encargaron de todo con mi seguro. Muy recomendables.",
              rating: 5
            },
            {
              name: "Cliente Verificado",
              text: "Rápidos y profesionales. Llamé por la mañana por un impacto y por la tarde ya estaba reparado. Trato excelente.",
              rating: 5
            },
            {
              name: "Cliente Verificado",
              text: "El mejor taller de lunas de Barcelona. Precios claros y trabajo de calidad. Repetiré si vuelvo a tener un problema.",
              rating: 5
            },
          ].map((r, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-4">&quot;{r.text}&quot;</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">— {r.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 48 48">
                  <path fill="currentColor" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            Ver más reseñas en Google
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Contacto / Form ────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contacto" className="py-16 md:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              ¿Necesitas un <span className="text-red-500">presupuesto?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Rellena el formulario y nos pondremos en contacto contigo en menos de 10 minutos para darte una solución.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-600/10 rounded-xl">
                  <Phone className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Llámanos directamente</p>
                  <p className="text-xl font-bold text-white">{PHONE_DISPLAY}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-600/10 rounded-xl">
                  <MessageCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">WhatsApp 24/7</p>
                  <p className="text-xl font-bold text-white">Respuesta inmediata</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-950 p-8 rounded-3xl border border-gray-800 shadow-2xl">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    className="w-full bg-gray-900 border border-gray-700 focus:border-red-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="6XX XXX XXX"
                    className="w-full bg-gray-900 border border-gray-700 focus:border-red-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Vehículo y problema
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ej: Ford Focus 2020, grieta en el parabrisas delantero"
                  className="w-full bg-gray-900 border border-gray-700 focus:border-red-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors text-base"
              >
                Enviar solicitud
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-xs text-gray-500 text-center">
                Te respondemos en menos de 10 minutos en horario de atención.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="flex flex-col bg-gray-950 text-white pb-[72px] lg:pb-0">
      <Hero />
      <Services />
      <Value />
      <InsuranceSection />
      <Trust />
      <Reviews />
      <Contact />
      <StickyMobileCTA />
    </div>
  );
}

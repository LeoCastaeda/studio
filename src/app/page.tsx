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
    <section className="relative min-h-[92svh] flex items-center overflow-hidden bg-gray-950">
      {/* Video fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover object-[center_50%] opacity-60 scale-110 transition-opacity duration-1000"
        aria-hidden="true"
      >
        <source src="/video/hero_video.mp4" type="video/mp4" />
      </video>
      
      {/* Capas de gradiente para profundidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/40 to-gray-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/40 via-transparent to-gray-950/40" />

      <div className="relative z-10 w-full container mx-auto px-4 py-20 pb-32 md:pb-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Badge ubicación con glassmorphism */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-red-400 text-sm font-semibold px-4 py-2 rounded-full mb-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Barcelona · Les Corts
          </div>

          {/* Headline con efecto de brillo en el texto rojo */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-[1.05] mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Cambio y reparación de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              lunas de coche
            </span>{" "}
            en el mismo día
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-400">
            Especialistas en cristalería del automóvil. 
            <span className="block mt-2 font-normal text-white/90">Sin esperas, con todas las aseguradoras y garantía de por vida.</span>
          </p>

          {/* Beneficios clave con mejor espaciado */}
          <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-5 sm:gap-10 mb-14 animate-in fade-in duration-1000 delay-600">
            {[
              "Reparación en 30 min",
              "Trámites con tu seguro",
              "Cristales Homologados",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-white/90 font-semibold text-base">
                <div className="bg-green-500/20 p-1 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                {b}
              </li>
            ))}
          </ul>

          {/* CTAs con efectos premium */}
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-800">
            <a
              href={TEL_URL}
              className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-red-600 hover:bg-red-500 text-white font-black text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(220,38,38,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <Phone className="h-6 w-6" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-10 py-5 bg-green-600 hover:bg-green-500 text-white font-black text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(22,163,74,0.3)]"
            >
              <MessageCircle className="h-6 w-6" />
              WhatsApp
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4 text-gray-400 animate-in fade-in duration-1000 delay-1000">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-gray-950 bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium">
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
    desc: "Astillas y grietas pequeñas reparadas en 30 min. Evitas el cambio completo.",
    time: "~30 min",
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
    desc: "Trabajamos con todas las aseguradoras. Nosotros hacemos los trámites, tú no te preocupas de nada.",
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
          Trabajamos con todas las aseguradoras
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

        <div className="bg-gradient-to-br from-red-900/30 to-gray-900 border border-red-800/30 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto text-center">
          <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Garantía de por vida en la instalación
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Todos nuestros trabajos incluyen garantía total mientras seas propietario del vehículo. Si hay cualquier problema con la instalación, lo solucionamos sin coste.
          </p>
          <a
            href={TEL_URL}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-colors"
          >
            Saber más sobre la garantía
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonios (Simplificado) ─────────────────────────────── */
function Reviews() {
  return (
    <section className="py-16 md:py-24 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex items-center justify-center gap-1 text-yellow-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
            <span className="ml-2 text-white font-bold text-lg">4.9/5 en Google</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Jordi M.",
              text: "Servicio impecable. Me cambiaron el parabrisas en 1 hora y se encargaron de todo con mi seguro. Muy recomendables.",
            },
            {
              name: "Marta R.",
              text: "Rápidos y profesionales. Llamé por la mañana por un impacto y por la tarde ya estaba reparado. Trato excelente.",
            },
            {
              name: "Carlos T.",
              text: "El mejor taller de lunas de Barcelona. Precios claros y trabajo de calidad. Repetiré si vuelvo a tener un problema.",
            },
          ].map((r) => (
            <div key={r.name} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 italic text-gray-300 relative">
              &quot;{r.text}&quot;
              <div className="mt-4 not-italic font-bold text-white">— {r.name}</div>
            </div>
          ))}
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

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
        className="absolute inset-0 h-full w-full object-cover object-[50%_30%] md:object-center opacity-40"
        aria-hidden="true"
      >
        <source src="/video/hero_video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/50 to-gray-950" />

      <div className="relative z-10 w-full container mx-auto px-4 py-20 pb-32 md:pb-20">
        <div className="max-w-2xl">
          {/* Badge ubicación */}
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/40 text-red-400 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
            <MapPin className="h-3.5 w-3.5" />
            Barcelona · Les Corts
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Cambio y reparación de{" "}
            <span className="text-red-500">lunas de coche</span>{" "}
            en el mismo día
          </h1>

          <p className="text-lg text-gray-300 mb-8 max-w-xl">
            Especialistas en parabrisas y cristales de automoción en Barcelona.
            Trabajamos con tu seguro, sin costes ocultos y con garantía total.
          </p>

          {/* Beneficios clave */}
          <ul className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10">
            {[
              "Reparación desde 30 min",
              "Gestionamos tu seguro",
              "Garantía de por vida",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2 text-white font-medium">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          {/* CTAs desktop */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={TEL_URL}
              className="flex items-center justify-center gap-2 px-7 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-red-900/40"
            >
              <Phone className="h-5 w-5" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl transition-colors shadow-lg shadow-green-900/40"
            >
              <MessageCircle className="h-5 w-5" />
              Escribir por WhatsApp
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            ¿Duda? Llámanos gratis · Lunes a sábado 8h–20h
          </p>
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
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Phone className="h-4 w-4" />
            Pedir presupuesto gratis
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Reseñas ─────────────────────────────────────────────────── */
const REVIEWS = [
  {
    author: "Victor L.",
    text: "La atención es inmejorable, te avisan de cuando reciben el cristal y en 1 hora lo tienes listo. Calidad-precio de lo mejor que he encontrado en Barcelona.",
    stars: 5,
  },
  {
    author: "Jose K.",
    text: "El mejor precio de toda Barcelona, el trabajo impecable, el trato excelente, muy puntuales. 100% recomendados.",
    stars: 5,
  },
  {
    author: "Juan A.",
    text: "Servicio súper profesional y rápido. Me gestionaron todo súper rápido. El trato con el cliente es exquisito y el precio muy competitivo.",
    stars: 5,
  },
];

function Reviews() {
  return (
    <section className="py-16 md:py-24 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex items-center justify-center gap-1 text-yellow-400 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400" />)}
          </div>
          <p className="text-gray-400">+500 reseñas verificadas en Google</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {REVIEWS.map((r) => (
            <div key={r.author} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex gap-0.5 mb-4">
                {[...Array(r.stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{r.text}"</p>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                  {r.author.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{r.author}</p>
                  <p className="text-gray-500 text-xs">Reseña de Google</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contacto / Conversión ───────────────────────────────────── */
function Contact() {
  return (
    <section id="contacto" className="py-16 md:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">

          {/* Info contacto */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Pide tu presupuesto gratis
            </h2>
            <p className="text-gray-400 mb-8">
              Cuéntanos qué le ha pasado a tu luna y te llamamos con el precio en menos de 10 minutos. Sin compromiso.
            </p>

            <div className="space-y-4 mb-8">
              <a
                href={TEL_URL}
                className="flex items-center gap-4 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-4 rounded-xl transition-colors w-full"
              >
                <Phone className="h-6 w-6 shrink-0" />
                <div>
                  <div className="text-xs font-normal opacity-80">Llamar directamente</div>
                  <div className="text-lg">{PHONE_DISPLAY}</div>
                </div>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-4 rounded-xl transition-colors w-full"
              >
                <MessageCircle className="h-6 w-6 shrink-0" />
                <div>
                  <div className="text-xs font-normal opacity-80">Enviar mensaje</div>
                  <div className="text-lg">WhatsApp</div>
                </div>
              </a>
            </div>

            <div className="flex items-start gap-3 text-gray-400 text-sm">
              <MapPin className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Glassnou Barcelona</p>
                <p>Carrer Maria Barrientos, 23 Local 2</p>
                <p>08028 Barcelona (Les Corts)</p>
                <p className="mt-1">Lunes–Sábado: 8:00–20:00</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-white mb-6">Solicitar presupuesto</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = WHATSAPP_URL;
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Nombre
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

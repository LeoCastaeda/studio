import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/data";
import { Phone, MessageCircle, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Glassnou Barcelona",
  description:
    "Resolvemos tus dudas sobre reparación y cambio de lunas de coche en Barcelona. Tiempos, seguros, garantías y más.",
};

const PHONE = "+34686770074";
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hola, tengo una pregunta sobre vuestro servicio de lunas.")}`;

export default function FaqPage() {
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
          <div className="inline-flex items-center justify-center bg-red-600/20 border border-red-600/30 rounded-full p-4 mb-6 backdrop-blur-sm">
            <HelpCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Preguntas frecuentes
          </h1>
          <p className="text-gray-200 text-lg drop-shadow">
            Resolvemos las dudas más comunes sobre nuestro servicio de cristales de automoción en Barcelona.
          </p>
        </div>
      </section>


      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gray-900 border border-gray-800 rounded-xl px-6 data-[state=open]:border-red-600/40"
              >
                <AccordionTrigger className="text-left font-semibold text-white hover:text-red-400 hover:no-underline py-5 transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA al final */}
          <div className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              ¿No encuentras la respuesta?
            </h2>
            <p className="text-gray-400 mb-6">
              Llámanos o escríbenos por WhatsApp y te respondemos en minutos.
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

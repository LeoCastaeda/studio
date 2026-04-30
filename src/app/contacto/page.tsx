"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitContactForm } from "./actions";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Mail, Phone, MapPin, MessageCircle, Clock, Send,
} from "lucide-react";

const PHONE = "+34686770074";
const PHONE_DISPLAY = "+34 686 770 074";
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hola, necesito información sobre vuestros servicios de lunas.")}`;
const MAPS_URL =
  "https://www.google.com/maps/place/GLASSNOU+I+Taller+de+reparaci%C3%B3n,+sustituci%C3%B3n,+tintado+y+venta+de+lunas+de+coche+Barcelona/@41.3809456,2.1253225,17z";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  email: z.string().email("Introduce un email válido."),
  subject: z.string().min(3, "El asunto debe tener al menos 3 caracteres."),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres."),
});

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    const response = await submitContactForm(values);
    if (response.success) {
      toast({ title: "¡Mensaje enviado!", description: response.success });
      form.reset();
    } else {
      toast({ title: "Error", description: response.error, variant: "destructive" });
    }
  }

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
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Contacta con nosotros
          </h1>
          <p className="text-gray-200 text-lg drop-shadow">
            ¿Tienes una luna rota o dañada? Llámanos o escríbenos y te ayudamos hoy mismo.
          </p>
        </div>
      </section>


      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-5 gap-8">

          {/* Sidebar: contacto directo */}
          <div className="md:col-span-2 space-y-4">
            {/* Llamar */}
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-4 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-4 rounded-2xl transition-colors w-full"
            >
              <div className="p-2 bg-red-700 rounded-xl">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-normal opacity-80">Llamar ahora</div>
                <div className="text-lg">{PHONE_DISPLAY}</div>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-4 rounded-2xl transition-colors w-full"
            >
              <div className="p-2 bg-green-700 rounded-xl">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-normal opacity-80">Escribir mensaje</div>
                <div className="text-lg">WhatsApp</div>
              </div>
            </a>

            {/* Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm">Email</p>
                  <a href="mailto:glassnou@gmail.com" className="text-gray-400 hover:text-white text-sm transition-colors">
                    glassnou@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm">Dirección</p>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm transition-colors leading-relaxed"
                  >
                    Carrer Maria Barrientos, 23 Local 2<br />
                    Les Corts · 08028 Barcelona
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm">Horario</p>
                  <p className="text-gray-400 text-sm">Lun–Vie: 8:00 – 20:00</p>
                  <p className="text-gray-400 text-sm">Sábado: 8:00 – 14:00</p>
                </div>
              </div>
            </div>

            {/* Mapa embed */}
            <div className="rounded-2xl overflow-hidden border border-gray-800 h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.4!2d2.1278974!3d41.3809456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49981ea0f2679%3A0x757434d486669db9!2sGLASSNOU!5e0!3m2!1ses!2ses!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Glassnou Barcelona"
              />
            </div>
          </div>

          {/* Formulario */}
          <div className="md:col-span-3 bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6">Envíanos un mensaje</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field}
                          className="bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="tu@email.com" {...field}
                          className="bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Asunto</FormLabel>
                    <FormControl>
                      <Input placeholder="¿En qué podemos ayudarte?" {...field}
                        className="bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Mensaje</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Cuéntanos tu caso..." className="min-h-[130px] bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors text-base"
                >
                  {isSubmitting
                    ? <><Loader2 className="h-5 w-5 animate-spin" /> Enviando...</>
                    : <><Send className="h-5 w-5" /> Enviar mensaje</>
                  }
                </button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}

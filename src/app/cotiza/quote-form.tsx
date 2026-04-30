// app/cotiza/quote-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { products } from "@/lib/data";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Send, Phone, MessageCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

const PHONE = "+34686770074";
const PHONE_DISPLAY = "+34 686 770 074";

const quoteSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  phone: z.string().min(9, "Introduce un teléfono válido."),
  vehicleMake: z.string().min(2, "La marca es obligatoria."),
  vehicleModel: z.string().min(1, "El modelo es obligatorio."),
  vehicleYear: z.string().min(4, "El año debe tener 4 dígitos.").max(4),
  licensePlate: z.string().min(1, "La matrícula es obligatoria."),
  glassType: z.string({ required_error: "Selecciona el tipo de cristal." }),
  paymentMethod: z.string({ required_error: "Selecciona el método de pago." }),
  message: z.string().optional(),
  dataProtection: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de protección de datos.",
  }),
});

export default function QuoteForm({ initialGlassType = "" }: { initialGlassType?: string }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      phone: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      licensePlate: "",
      message: "",
      glassType: initialGlassType,
      paymentMethod: "",
      dataProtection: false,
    },
  });

  function onSubmit(values: z.infer<typeof quoteSchema>) {
    const messageParts = [
      `*Nueva Solicitud de Presupuesto*`,
      `*Cliente:* ${values.name}`,
      `*Teléfono:* ${values.phone}`,
      `---`,
      `*Vehículo:* ${values.vehicleMake} ${values.vehicleModel} (${values.vehicleYear})`,
      `*Matrícula:* ${values.licensePlate}`,
      `*Cristal:* ${values.glassType}`,
      `*Pago:* ${values.paymentMethod}`,
    ];
    if (values.message) messageParts.push("---", values.message);

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(messageParts.filter(Boolean).join("\n"))}`;
    window.open(url, "_blank");

    toast({
      title: "¡Casi listo!",
      description: "Se ha abierto WhatsApp. Solo pulsa enviar.",
    });

    form.reset();
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
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%] md:object-center"
          aria-hidden="true"
        >
          <source src="/video/video_blog.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent" aria-hidden="true" />

        <div className="relative z-10 container mx-auto max-w-3xl text-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Solicitar presupuesto
          </h1>
          <p className="text-gray-200 text-lg drop-shadow">
            Rellena el formulario y te respondemos en menos de 10 minutos. Sin compromiso.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {["Presupuesto gratuito", "Sin compromiso", "Respuesta en 10 min"].map((b) => (
              <span key={b} className="flex items-center gap-2 text-green-400 text-sm font-medium backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full border border-white/10">
                <CheckCircle className="h-4 w-4" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>


      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-3 gap-8 items-start">

          {/* Sidebar contacto directo */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">¿Prefieres llamar?</p>
              <a
                href={`tel:${PHONE}`}
                className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl transition-colors w-full mb-3"
              >
                <Phone className="h-5 w-5" />
                <div>
                  <div className="text-xs opacity-80 font-normal">Llamar ahora</div>
                  <div>{PHONE_DISPLAY}</div>
                </div>
              </a>
              <a
                href={`https://wa.me/${PHONE}?text=${encodeURIComponent("Hola, quiero pedir presupuesto.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl transition-colors w-full"
              >
                <MessageCircle className="h-5 w-5" />
                <div>
                  <div className="text-xs opacity-80 font-normal">Escribir</div>
                  <div>WhatsApp</div>
                </div>
              </a>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-sm text-gray-400 space-y-2">
              <p className="text-white font-semibold">Horario de atención</p>
              <p>Lunes – Viernes: 8:00 – 20:00</p>
              <p>Sábado: 8:00 – 14:00</p>
              <p>Domingo: Cerrado</p>
            </div>
          </div>

          {/* Formulario */}
          <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field}
                          className="bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="phone" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="6XX XXX XXX" {...field}
                          className="bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <FormField name="vehicleMake" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota" {...field}
                          className="bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="vehicleModel" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Corolla" {...field}
                          className="bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="vehicleYear" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Año</FormLabel>
                      <FormControl>
                        <Input placeholder="2022" {...field}
                          className="bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField name="licensePlate" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Matrícula</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 ABC" {...field}
                        className="bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField name="glassType" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Tipo de cristal</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-950 border-gray-700 text-white">
                            <SelectValue placeholder="Selecciona el cristal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.name} className="focus:bg-gray-800">{p.name}</SelectItem>
                          ))}
                          <SelectItem value="Otro" className="focus:bg-gray-800">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="paymentMethod" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Forma de pago</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-950 border-gray-700 text-white">
                            <SelectValue placeholder="¿Cómo pagarás?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-700 text-white">
                          <SelectItem value="Contado" className="focus:bg-gray-800">Contado</SelectItem>
                          <SelectItem value="Compañía de Seguros" className="focus:bg-gray-800">Seguro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField name="message" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Información adicional (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe el daño, si tienes sensores, cámara, etc."
                        {...field}
                        className="bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:border-red-500 resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="dataProtection" control={form.control} render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-gray-950 border border-gray-700 rounded-xl p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange}
                        className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-gray-300 font-normal cursor-pointer">
                        He leído y acepto la{" "}
                        <Link href="/proteccion-datos" className="text-red-400 underline hover:text-red-300" target="_blank">
                          política de protección de datos
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-colors text-base"
                >
                  <Send className="h-5 w-5" />
                  Enviar solicitud por WhatsApp
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Al enviar, se abrirá WhatsApp con tu solicitud lista para enviarnos.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}

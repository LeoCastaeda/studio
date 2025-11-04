// app/quote/quote-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { products } from "@/lib/data";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import Link from "next/link";

const quoteSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  email: z.string().email("Correo electrónico no válido."),
  phone: z.string().optional(),
  vehicleYear: z.string().min(4, "El año debe tener 4 dígitos.").max(4, "El año debe tener 4 dígitos."),
  vehicleMake: z.string().min(2, "La marca es obligatoria."),
  vehicleModel: z.string().min(1, "El modelo es obligatorio."),
  vin: z.string().optional(),
  glassType: z.string({ required_error: "Por favor, seleccione el tipo de cristal." }),
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
      email: "",
      phone: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      vin: "",
      message: "",
      glassType: initialGlassType, // ✅ viene del server
      dataProtection: false,
    },
  });

  function onSubmit(values: z.infer<typeof quoteSchema>) {
    const glassNouPhoneNumber = "34686770074";

    const messageParts = [
      `*Nueva Solicitud de Cotización*`,
      `*Cliente:* ${values.name}`,
      `*Email:* ${values.email}`,
      values.phone ? `*Teléfono:* ${values.phone}` : "",
      `---`,
      `*Vehículo:* ${values.vehicleMake} ${values.vehicleModel} (${values.vehicleYear})`,
      values.vin ? `*VIN:* ${values.vin}` : "",
      `*Cristal Solicitado:* ${values.glassType}`,
    ];
    if (values.message) {
      messageParts.push("---", "*Mensaje Adicional:*", values.message);
    }

    const whatsappMessage = encodeURIComponent(messageParts.filter(Boolean).join("\n"));
    const whatsappUrl = `https://wa.me/${glassNouPhoneNumber}?text=${whatsappMessage}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "¡Casi listo!",
      description: "Se ha abierto WhatsApp para que envíes tu solicitud. ¡Solo pulsa enviar!",
    });

    form.reset();
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Solicitar una Cotización</CardTitle>
          <CardDescription>
            Rellena el formulario. Al finalizar, se abrirá WhatsApp con un mensaje listo para que nos lo envíes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl><Input placeholder="Juan Pérez" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl><Input placeholder="tu@ejemplo.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Teléfono (Opcional)</FormLabel>
                  <FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FormField name="vehicleYear" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año del Vehículo</FormLabel>
                    <FormControl><Input placeholder="2023" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="vehicleMake" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca del Vehículo</FormLabel>
                    <FormControl><Input placeholder="Toyota" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="vehicleModel" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo del Vehículo</FormLabel>
                    <FormControl><Input placeholder="Camry" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField name="vin" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN (Número de Identificación del Vehículo)</FormLabel>
                  <FormControl><Input placeholder="Introduce tu VIN de 17 dígitos" {...field} /></FormControl>
                  <FormDescription>Proporcionar el VIN nos asegura encontrar la coincidencia exacta para tu vehículo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="glassType" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Cristal Necesario</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el cristal que necesitas reemplazar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.name}>{product.name}</SelectItem>
                      ))}
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="message" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Información Adicional (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Cuéntanos más sobre tus necesidades, p.ej., sensores de lluvia, HUD, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="dataProtection" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      He leído y acepto la{" "}
                      <Link
                        href="/proteccion-datos"
                        className="text-primary underline hover:text-primary/80"
                        target="_blank"
                      >
                        política de protección de datos
                      </Link>
                    </FormLabel>
                    <FormDescription>
                      Tus datos serán tratados conforme a nuestra política de privacidad.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )} />

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Enviar por WhatsApp
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

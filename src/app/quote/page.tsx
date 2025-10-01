"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitQuoteRequest } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const quoteSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  email: z.string().email("Correo electrónico no válido."),
  phone: z.string().optional(),
  vehicleYear: z.string().min(4, "El año debe tener 4 dígitos.").max(4, "El año debe tener 4 dígitos."),
  vehicleMake: z.string().min(2, "La marca es obligatoria."),
  vehicleModel: z.string().min(1, "El modelo es obligatorio."),
  vin: z.string().optional(),
  glassType: z.string({ required_error: "Por favor, seleccione el tipo de cristal."}),
  message: z.string().optional(),
});

export default function QuotePage() {
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
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof quoteSchema>) {
    const response = await submitQuoteRequest(values);
    if (response.success) {
      toast({
        title: "¡Éxito!",
        description: response.success,
        variant: "default",
      });
      form.reset();
    } else {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    }
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Solicitar una Cotización</CardTitle>
          <CardDescription>
            Rellena el formulario a continuación y te responderemos con una cotización personalizada para tus necesidades de cristales de auto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder="tu@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Teléfono (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <FormField
                  control={form.control}
                  name="vehicleYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año del Vehículo</FormLabel>
                      <FormControl>
                        <Input placeholder="2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleMake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca del Vehículo</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo del Vehículo</FormLabel>
                      <FormControl>
                        <Input placeholder="Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                  control={form.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN (Número de Identificación del Vehículo)</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduce tu VIN de 17 dígitos" {...field} />
                      </FormControl>
                      <FormDescription>Proporcionar el VIN nos asegura encontrar la coincidencia exacta para tu vehículo.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="glassType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cristal Necesario</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el cristal que necesitas reemplazar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="front-windshield">Parabrisas Delantero</SelectItem>
                        <SelectItem value="rear-windshield">Luneta Trasera</SelectItem>
                        <SelectItem value="driver-side-window">Ventana del Conductor</SelectItem>
                        <SelectItem value="passenger-side-window">Ventana del Pasajero</SelectItem>
                        <SelectItem value="side-mirror">Espejo Lateral</SelectItem>
                        <SelectItem value="sunroof">Techo Solar</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Información Adicional (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Cuéntanos más sobre tus necesidades, p.ej., características específicas como sensores de lluvia, HUD, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</> : "Enviar Solicitud de Cotización"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

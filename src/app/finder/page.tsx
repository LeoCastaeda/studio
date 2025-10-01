"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCompatibleGlass } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  vehicleYear: z.string().min(4, "El año debe tener 4 dígitos.").max(4, "El año debe tener 4 dígitos.").regex(/^\d{4}$/, "Por favor, introduce un año válido."),
  vehicleMake: z.string().min(2, "La marca es obligatoria."),
  vehicleModel: z.string().min(1, "El modelo es obligatorio."),
});

export default function FinderPage() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    const response = await getCompatibleGlass(values);
    if (response.data) {
      setResult(response.data);
    } else if (response.error) {
      setError(response.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-headline">Buscador de Cristales con IA</CardTitle>
            <CardDescription>
              Introduce los detalles de tu vehículo a continuación, y nuestra IA encontrará productos de cristal compatibles para ti.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="vehicleYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año del Vehículo</FormLabel>
                      <FormControl>
                        <Input placeholder="p.ej., 2023" {...field} />
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
                        <Input placeholder="p.ej., Toyota" {...field} />
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
                        <Input placeholder="p.ej., Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Buscando Cristales...
                    </>
                  ) : (
                    "Buscar Cristales Compatibles"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          {(result || error) && (
             <CardFooter className="flex flex-col items-start p-6 border-t">
                {result && (
                  <div className="w-full">
                    <h3 className="font-semibold text-lg mb-2">Productos Compatibles:</h3>
                    <p className="text-muted-foreground p-4 bg-secondary rounded-md">{result}</p>
                    <p className="text-sm mt-4 text-muted-foreground">Ahora puedes usar esta información para <Link href="/products" className="text-primary underline">buscar en nuestros productos</Link> o <Link href="/quote" className="text-primary underline">solicitar una cotización</Link>.</p>
                  </div>
                )}
                {error && (
                  <div className="w-full bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-md flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold">Ocurrió un error</h4>
                        <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
             </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

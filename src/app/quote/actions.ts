'use server';

import { z } from 'zod';

const quoteSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  email: z.string().email("Correo electrónico no válido."),
  phone: z.string().optional(),
  vehicleYear: z.string().min(4, "El año es obligatorio.").max(4, "El año debe tener 4 dígitos."),
  vehicleMake: z.string().min(2, "La marca es obligatoria."),
  vehicleModel: z.string().min(1, "El modelo es obligatorio."),
  vin: z.string().optional(),
  glassType: z.string({ required_error: "Por favor, seleccione el tipo de cristal."}),
  message: z.string().optional(),
});

export async function submitQuoteRequest(values: z.infer<typeof quoteSchema>) {
  const validatedFields = quoteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Datos no válidos. Por favor, revise el formulario e inténtalo de nuevo.' };
  }

  // In a real app, you would save this to a database or send an email.
  console.log('Nueva Solicitud de Cotización:', validatedFields.data);

  return { success: '¡Tu solicitud de cotización ha sido enviada con éxito! Nos pondremos en contacto contigo en breve.' };
}

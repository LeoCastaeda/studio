'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  email: z.string().email("Por favor, introduce una dirección de correo electrónico válida."),
  subject: z.string().min(3, "El asunto debe tener al menos 3 caracteres."),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres."),
});

export async function submitContactForm(values: z.infer<typeof contactSchema>) {
  const validatedFields = contactSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Datos no válidos. Por favor, revisa el formulario e inténtalo de nuevo.' };
  }

  // In a real app, you would save this to a database or send an email.
  console.log('Nuevo mensaje de contacto:', validatedFields.data);

  return { success: '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.' };
}

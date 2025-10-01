'use server';

import { findGlass, type FindGlassInput } from '@/ai/flows/glass-finder-tool';
import { z } from 'zod';

const formSchema = z.object({
  vehicleYear: z.string().min(4, "El año debe tener 4 dígitos.").max(4, "El año debe tener 4 dígitos."),
  vehicleMake: z.string().min(2, "La marca es obligatoria."),
  vehicleModel: z.string().min(1, "El modelo es obligatorio."),
});

export async function getCompatibleGlass(values: FindGlassInput) {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return { error: `Entrada no válida: ${Object.values(errors).flat().join(', ')}` };
  }

  try {
    const result = await findGlass(validatedFields.data);
    return { data: result.compatibleProducts };
  } catch (error) {
    console.error("Error en el flujo de IA:", error);
    return { error: 'No se pudo encontrar el vidrio compatible. Nuestro servicio de IA podría no estar disponible temporalmente. Por favor, inténtalo de nuevo más tarde.' };
  }
}

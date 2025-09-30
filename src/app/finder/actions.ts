'use server';

import { findGlass, type FindGlassInput } from '@/ai/flows/glass-finder-tool';
import { z } from 'zod';

const formSchema = z.object({
  vehicleYear: z.string().min(4, "Year must be 4 digits.").max(4, "Year must be 4 digits."),
  vehicleMake: z.string().min(2, "Make is required."),
  vehicleModel: z.string().min(1, "Model is required."),
});

export async function getCompatibleGlass(values: FindGlassInput) {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return { error: `Invalid input: ${Object.values(errors).flat().join(', ')}` };
  }

  try {
    const result = await findGlass(validatedFields.data);
    return { data: result.compatibleProducts };
  } catch (error) {
    console.error("AI flow error:", error);
    return { error: 'Failed to find compatible glass. Our AI service might be temporarily unavailable. Please try again later.' };
  }
}

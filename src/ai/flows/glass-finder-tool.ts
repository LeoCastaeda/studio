'use server';

/**
 * @fileOverview Glass Finder Tool AI agent.
 *
 * - findGlass - A function that handles the glass finding process.
 * - FindGlassInput - The input type for the findGlass function.
 * - FindGlassOutput - The return type for the findGlass function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindGlassInputSchema = z.object({
  vehicleYear: z.string().describe('The year of the vehicle.'),
  vehicleMake: z.string().describe('The make of the vehicle.'),
  vehicleModel: z.string().describe('The model of the vehicle.'),
});
export type FindGlassInput = z.infer<typeof FindGlassInputSchema>;

const FindGlassOutputSchema = z.object({
  compatibleProducts: z
    .string()
    .describe('A list of compatible glass products for the vehicle.'),
});
export type FindGlassOutput = z.infer<typeof FindGlassOutputSchema>;

export async function findGlass(input: FindGlassInput): Promise<FindGlassOutput> {
  return findGlassFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findGlassPrompt',
  input: {schema: FindGlassInputSchema},
  output: {schema: FindGlassOutputSchema},
  prompt: `You are an expert car glass finder. You will find the list of compatible glass products for the vehicle based on the year, make, and model.

Vehicle Year: {{{vehicleYear}}}
Vehicle Make: {{{vehicleMake}}}
Vehicle Model: {{{vehicleModel}}}

Return a comma separated list of compatible products.`,
});

const findGlassFlow = ai.defineFlow(
  {
    name: 'findGlassFlow',
    inputSchema: FindGlassInputSchema,
    outputSchema: FindGlassOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

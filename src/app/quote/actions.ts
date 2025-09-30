'use server';

import { z } from 'zod';

const quoteSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  vehicleYear: z.string().min(4, "Year is required.").max(4, "Year must be 4 digits."),
  vehicleMake: z.string().min(2, "Make is required."),
  vehicleModel: z.string().min(1, "Model is required."),
  vin: z.string().optional(),
  glassType: z.string({ required_error: "Please select the type of glass."}),
  message: z.string().optional(),
});

export async function submitQuoteRequest(values: z.infer<typeof quoteSchema>) {
  const validatedFields = quoteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid data provided. Please check the form and try again.' };
  }

  // In a real app, you would save this to a database or send an email.
  console.log('New Quote Request:', validatedFields.data);

  return { success: 'Your quote request has been submitted successfully! We will get back to you shortly.' };
}

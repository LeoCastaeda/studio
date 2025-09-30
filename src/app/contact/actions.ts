'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function submitContactForm(values: z.infer<typeof contactSchema>) {
  const validatedFields = contactSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid data provided. Please check the form and try again.' };
  }

  // In a real app, you would save this to a database or send an email.
  console.log('New Contact Message:', validatedFields.data);

  return { success: 'Thank you for your message! We will get back to you soon.' };
}

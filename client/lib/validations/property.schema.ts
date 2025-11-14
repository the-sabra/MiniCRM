import { z } from 'zod';

export const propertyFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  price: z
    .number({
      error: 'Price must be a number',
    })
    .positive('Price must be a positive number')
    .min(0.01, 'Price must be at least $0.01'),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-character ISO code (e.g., USD, EUR)')
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, 'Currency must contain only letters'),
  location: z
    .string()
    .min(5, 'Location must be at least 5 characters')
    .max(255, 'Location must not exceed 255 characters')
    .trim(),
  bedrooms: z
    .number({
      error: 'Bedrooms must be a number',
    })
    .int('Bedrooms must be a whole number')
    .min(1, 'Must have at least 1 bedroom'),
  bathrooms: z
    .number({
      error: 'Bathrooms must be a number',
    })
    .int('Bathrooms must be a whole number')
    .min(1, 'Must have at least 1 bathroom'),
  status: z.enum(['available', 'sold'], {
    error: 'Status must be either "available" or "sold"',
  }),
});

export type PropertyFormSchema = z.infer<typeof propertyFormSchema>;

import { z } from 'zod'

export const customerSchema = z.object({
  full_name: z.string().trim().min(1, 'Full name is required').max(255),
  email: z.string().trim().email('Enter a valid email address'),
  phone_number: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .max(32, 'Phone number is too long'),
})

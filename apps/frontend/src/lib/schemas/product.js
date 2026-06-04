import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255),
  sku: z.string().trim().min(1, 'SKU is required').max(64),
  price: z.coerce.number().positive('Price must be greater than 0'),
  quantity_in_stock: z.coerce
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
})

export const productUpdateSchema = productSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Change at least one field to update',
  })

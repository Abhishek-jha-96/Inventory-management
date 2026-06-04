import { z } from 'zod'

export const orderLineSchema = z.object({
  product_id: z.coerce.number().int().positive('Select a product'),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be at least 1'),
})

export const orderSchema = z.object({
  customer_id: z.coerce.number().int().positive('Select a customer'),
  items: z.array(orderLineSchema).min(1, 'Add at least one line item'),
})

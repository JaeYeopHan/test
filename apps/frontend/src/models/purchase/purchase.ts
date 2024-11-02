import { z } from "zod"

export const PurchaseSchema = z.object({
  productId: z.number(),
  customerId: z.number(),
  quantity: z.number(),
  date: z.string(),
})

export type Purchase = z.infer<typeof PurchaseSchema>

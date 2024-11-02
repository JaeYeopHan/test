import { z } from "zod"

export const PurchaseFrequencySchema = z.object({
  range: z.string(),
  count: z.number()
})

export type PurchaseFrequency = z.infer<typeof PurchaseFrequencySchema>

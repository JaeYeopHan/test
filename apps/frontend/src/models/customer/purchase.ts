import { z } from "zod"

export const CustomerPurchaseRecordSchema = z.object({
  date: z.string(),
  quantity: z.number(),
  product: z.string(),
  price: z.number(),
  imgSrc: z.string(),
})

export type CustomerPurchaseRecord = z.infer<typeof CustomerPurchaseRecordSchema>

import { z } from "zod"

export const CustomerSchema = z.object({
  id: z.number(),
  name: z.string()
})

export type Customer = z.infer<typeof CustomerSchema>

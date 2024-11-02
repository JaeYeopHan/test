import { z } from "zod"

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  imgSrc: z.string(),
})

export type Product = z.infer<typeof ProductSchema>

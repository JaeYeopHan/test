import { httpClient } from "@/lib/http-client";
import { PurchaseFrequencySchema } from "@/models/purchase/frequency";
import { z } from "zod";

interface PurchaseMessages {
  getPurchaseFrequency: (params: GetPurchaseFrequencyParams) => Promise<GetPurchaseFrequencyResponse>
}

const GetPurchaseFrequencyResponseSchema = z.array(PurchaseFrequencySchema)

const GetPurchaseFrequencyParamsSchema = z.object({
  from: z.string(),
  to: z.string()
})

type GetPurchaseFrequencyResponse = z.infer<typeof GetPurchaseFrequencyResponseSchema>
type GetPurchaseFrequencyParams = z.infer<typeof GetPurchaseFrequencyParamsSchema>

async function getPurchaseFrequency(_params: GetPurchaseFrequencyParams): Promise<GetPurchaseFrequencyResponse> {
  const params = GetPurchaseFrequencyParamsSchema.parse(_params)
  const _response = await httpClient.get(`/api/purchase-frequency?from=${params.from}&to=${params.to}`)

  return GetPurchaseFrequencyResponseSchema.parse(_response)
}

export const purchaseMessages: PurchaseMessages = {
  getPurchaseFrequency,
}

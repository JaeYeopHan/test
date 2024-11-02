import { httpClient } from "@/lib/http-client"
import { CustomerSchema } from "@/models/customer/customer"
import { CustomerPurchaseRecordSchema } from "@/models/customer/purchase"
import { z } from "zod"

interface CustomersMessages {
  getCustomers: () => Promise<GetCustomersResponse>
  getPurchaseByCustomer: (params: GetPurchaseByCustomerParams) => Promise<GetPurchaseByCustomerResponse>
}

const GetCustomersResponseSchema = z.array(CustomerSchema)

type GetCustomersResponse = z.infer<typeof GetCustomersResponseSchema>

async function getCustomers(): Promise<GetCustomersResponse> {
  const _response = await httpClient.get('/api/customers')
  const response = GetCustomersResponseSchema.parse(_response)

  return response
}

const GetPurchaseByCustomerParamsSchema = z.object({
  customerId: z.number(),
})

type GetPurchaseByCustomerParams = z.infer<typeof GetPurchaseByCustomerParamsSchema>

const GetPurchaseByCustomerResponseSchema = z.array(CustomerPurchaseRecordSchema)

type GetPurchaseByCustomerResponse = z.infer<typeof GetPurchaseByCustomerResponseSchema>

async function getPurchaseByCustomer(params: GetPurchaseByCustomerParams): Promise<GetPurchaseByCustomerResponse> {
  const _response = await httpClient.get(`/api/customers/${params.customerId}/purchases`)
  const response = GetPurchaseByCustomerResponseSchema.parse(_response)

  return response
}

export const customersMessages: CustomersMessages = {
  getCustomers,
  getPurchaseByCustomer,
}

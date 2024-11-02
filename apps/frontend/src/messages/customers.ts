import { httpClient } from "@/lib/http-client"
import { CustomerSchema } from "@/models/customer/customer"
import { CustomerPurchaseRecordSchema } from "@/models/customer/purchase"
import { z } from "zod"

interface CustomersMessages {
  getCustomers: (params?: GetCustomersRequest) => Promise<GetCustomersResponse>
  getPurchasesByCustomer: (params: GetPurchasesByCustomerParams) => Promise<GetPurchasesByCustomerResponse>
}

const GetCustomersRequestSchema = z.object({
  sortBy: z.enum(['asc', 'desc']).optional(),
  name: z.string().optional(),
})

type GetCustomersRequest = z.infer<typeof GetCustomersRequestSchema>

const GetCustomersResponseSchema = z.array(
  z.object({
    count: z.number(),
    totalAmount: z.number(),
  }).merge(CustomerSchema),
)

type GetCustomersResponse = z.infer<typeof GetCustomersResponseSchema>

async function getCustomers(params?: GetCustomersRequest): Promise<GetCustomersResponse> {
  const queryParams = new URLSearchParams()
  if (params?.sortBy) queryParams.set('sortBy', params.sortBy)
  if (params?.name) queryParams.set('name', params.name)
  const _response = await httpClient.get(`/api/customers?${queryParams.toString()}` )
  const response = GetCustomersResponseSchema.parse(_response)

  return response
}

const GetPurchaseByCustomerParamsSchema = z.object({
  customerId: z.number(),
})

type GetPurchasesByCustomerParams = z.infer<typeof GetPurchaseByCustomerParamsSchema>

const GetPurchasesByCustomerResponseSchema = z.array(CustomerPurchaseRecordSchema)

type GetPurchasesByCustomerResponse = z.infer<typeof GetPurchasesByCustomerResponseSchema>

async function getPurchasesByCustomer(params: GetPurchasesByCustomerParams): Promise<GetPurchasesByCustomerResponse> {
  const _response = await httpClient.get(`/api/customers/${params.customerId}/purchases`)
  const response = GetPurchasesByCustomerResponseSchema.parse(_response)

  return response
}

export const customersMessages: CustomersMessages = {
  getCustomers,
  getPurchasesByCustomer,
}

import { DataTable } from '@/components/data-table/data-table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { customersMessages } from '@/messages/customers'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'

export const Route = createFileRoute('/users')({
  component: RouteComponent,
  loader: async () => {
    const response = await customersMessages.getCustomers()
    return response
  },
})


type CustomerPurchaseSimpleRecord = {
  id: number
  name: string
  count: number
  totalAmount: number
}

function RouteComponent() {
  const data = Route.useLoaderData()
  const columns: ColumnDef<CustomerPurchaseSimpleRecord>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return <div className="text-left px-4">{row.original.name}</div>
      },
    },
    {
      accessorKey: "count",
      header: "Count",
      cell: ({ row }) => {
        return <div className="text-right">{row.original.count.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => {
        return <div className="text-right">{row.original.totalAmount.toLocaleString()}</div>
      },
    },
  ]

  return (
    <Container>
      <H1>Users</H1>
      <DataTable columns={columns} data={data} />
    </Container>
  )
}
 

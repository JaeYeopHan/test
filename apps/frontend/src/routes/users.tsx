import { AppSkeleton } from '@/components/app/app-skeleton'
import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { H1 } from '@/components/ui/h1'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { customersMessages } from '@/messages/customers'
import { CustomerPurchaseRecord } from '@/models/customer/purchase'
import { useForm } from '@tanstack/react-form'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, ErrorComponent, retainSearchParams } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import { SearchIcon } from 'lucide-react'
import { Suspense } from 'react'
import { z } from 'zod'

const SearchSchema = z.object({
  search_user_name: z.string().optional(),
  sort_total_amount: z.enum(['asc', 'desc']).optional(),
  detail_user_id: z.number().optional(),
  detail_user_name: z.string().optional(),
})

export const Route = createFileRoute('/users')({
  component: RouteComponent,
  pendingComponent: AppSkeleton,
  errorComponent: ErrorComponent,
  validateSearch: zodSearchValidator(SearchSchema),
  search: {
    middlewares: [retainSearchParams(['search_user_name', 'sort_total_amount'])],
  },
  loaderDeps: ({ search }) => {
    return {
      userName: search.search_user_name,
      sortTotalAmount: search.sort_total_amount,
    }
  },
  loader: async ({ deps }) => {
    const response = await customersMessages.getCustomers({
      name: deps.userName,
      sortBy: deps.sortTotalAmount,
    })
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
  const navigate = Route.useNavigate()
  const { searchUserName, searchSortTotalAmount, detailUserName, detailUserId } = Route.useSearch({
    select: (search) => ({
      searchUserName: search.search_user_name,
      searchSortTotalAmount: search.sort_total_amount,
      detailUserName: search.detail_user_name,
      detailUserId: search.detail_user_id,
    }),
  });

  return (
    <Container>
      <H1>Users</H1>
      <div className="flex items-center gap-12 mb-2 justify-between">
        <UserNameFilter value={searchUserName} onSubmit={value => navigate({ search: { search_user_name: value } })} />
        <SortSelect
          value={searchSortTotalAmount}
          onValueChange={value => navigate({ search: { sort_total_amount: value as 'asc' | 'desc' } })}
        />
      </div>
      <Drawer
        direction='right'
        onClose={() => {
          navigate({ search: { detail_user_id: undefined, detail_user_name: undefined } })
        }}
      >
        <CustomerPurchaseTable
          onRowClick={row => {
            navigate({ search: { detail_user_id: row.id, detail_user_name: row.name } })
          }}
        />
        <DrawerContent className='h-full right-0 left-auto'>
          <DrawerHeader>
            <DrawerTitle>[{detailUserId}] {detailUserName}</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <Suspense fallback={<div>Loading...</div>}>
            {detailUserId != null ? <CustomerPurchaseDetail id={detailUserId} /> : null}
          </Suspense>
        </DrawerContent>
      </Drawer>
    </Container>
  )
}

interface SearchForm {
  userName: string
}

interface UserNameFilterProps {
  value: string | undefined
  onSubmit: (value: string) => void
}

function UserNameFilter({ value, onSubmit }: UserNameFilterProps) {
  const form = useForm<SearchForm>({
    defaultValues: {
      userName: value ?? '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value.userName)
    },
  })

  return (
    <form
      className="flex items-center gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className='flex items-center gap-2 w-full'>
        <form.Field
          name="userName"
          validators={{ onChangeAsyncDebounceMs: 500 }}
          children={field => {
            return (
              <label className='w-full'>
                <Input
                  type="text"
                  placeholder="Search by name"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )
          }}
        />
        <form.Subscribe selector={state => state.isSubmitting} children={(isSubmitting) => {
          return <Button type="submit" aria-label="Search" disabled={isSubmitting}><SearchIcon /></Button>
        }} />
      </div>
    </form>
  )
}

interface SortSelectProps {
  value?: 'asc' | 'desc'
  onValueChange: (value: 'asc' | 'desc') => void
  className?: string;
}

function SortSelect({ value, onValueChange, className }: SortSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={value => onValueChange(value as 'asc' | 'desc')}
    >
      <SelectTrigger className={cn('w-[180px]', className)}>
        <SelectValue placeholder="Sort by total amount" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">Ascending</SelectItem>
        <SelectItem value="desc">Descending</SelectItem>
      </SelectContent>
    </Select>
  )
}


interface CustomerPurchaseTableProps {
  onRowClick?: (row: CustomerPurchaseSimpleRecord) => void
}

function CustomerPurchaseTable({ onRowClick }: CustomerPurchaseTableProps) {
  const data = Route.useLoaderData()

  const columns: ColumnDef<CustomerPurchaseSimpleRecord>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return <div className="text-center px-4">{row.original.id}</div>
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      enablePinning: true,
      cell: ({ row }) => {
        return <div className="text-center px-4">{row.original.name}</div>
      },
    },
    {
      accessorKey: "count",
      header: "Total Count",
      cell: ({ row }) => {
        return <div className="text-right px-4">{row.original.count.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      enableSorting: true,
      cell: ({ row }) => {
        return <div className="text-right px-4">{row.original.totalAmount.toLocaleString()}</div>
      },
    },
  ]
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowRender={(node, row) => {
        return (
          <DrawerTrigger asChild onClick={() => {
            onRowClick?.(row)
          }}
          >
            {node}
          </DrawerTrigger>
        )
      }}
    />
  )
}

function CustomerPurchaseDetail({ id }: { id: number }) {
  const { data } = useSuspenseQuery({
    queryKey: ['customer-purchases', id],
    queryFn: () => {
      if (id == null) {
        return
      }
      return customersMessages.getPurchasesByCustomer({ customerId: id })
    },
  })
  const columns: ColumnDef<CustomerPurchaseRecord>[] = [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "product",
      header: "Product",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "imgSrc",
      header: "Image",
      cell: ({ row }) => {
        return <img src={row.original.imgSrc} alt="Product" width={100} height={100} />
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data ?? []}
    />
  )
}

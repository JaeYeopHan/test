import { AppSkeleton } from '@/components/app/app-skeleton'
import { DataTable } from '@/components/data-table/data-table'
import { ErrorBoundary } from '@/components/error-boundary/error-boundary'
import { ErrorAlert } from '@/components/error/error-alert'
import { SkeletonCard } from '@/components/loading/skeleton-card'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { customersMessages } from '@/messages/customers'
import { CustomerPurchaseRecord } from '@/models/customer/purchase'
import { useForm } from '@tanstack/react-form'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, ErrorComponent, retainSearchParams } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'
import { ArrowDownToLine, ArrowUpToLine, SearchIcon } from 'lucide-react'
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
          onValueChange={value => navigate({ search: { sort_total_amount: value } })}
        />
      </div>
      <Sheet
        onOpenChange={(open) => {
          if (open === false) {
            navigate({ search: { detail_user_id: undefined, detail_user_name: undefined } })
          }
        }}
      >
        <CustomerPurchaseTable
          onRowClick={row => {
            navigate({ search: { detail_user_id: row.id, detail_user_name: row.name } })
          }}
        />
        <SheetContent className="w-[640px] sm:max-w-[720px] max-w-[720px]" side='right'>
          <SheetHeader>
            <SheetTitle>[{detailUserId}] {detailUserName}</SheetTitle>
            <SheetDescription>{detailUserName}님의 상세 구매 내역입니다.</SheetDescription>
          </SheetHeader>
          <ErrorBoundary renderFallback={({ error }) => <ErrorAlert error={error} />}>
            <Suspense fallback={<SkeletonCard />}>
              {detailUserId != null ? <CustomerPurchaseDetail id={detailUserId} /> : null}
            </Suspense>
          </ErrorBoundary>
        </SheetContent>
      </Sheet>
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
        <SelectItem value="asc" className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <ArrowUpToLine className="size-4" />
            <span>Ascending</span>
          </div>
        </SelectItem>
        <SelectItem value="desc" className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <ArrowDownToLine className="size-4" />
            <span>Descending</span>
          </div>
        </SelectItem>
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
          <SheetTrigger
            asChild
            onClick={() => {
            onRowClick?.(row)
          }}
          >
            {node}
          </SheetTrigger>
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
      cell: ({ row }) => {
        return <div className="text-center px-2 whitespace-nowrap">{row.original.date}</div>
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        return <div className="text-right px-2">{row.original.quantity.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "product",
      header: "Product",
    },
    {
      accessorKey: "price",
      header: "Price (Won)",
      cell: ({ row }) => {
        return <div className="text-right px-2">{row.original.price.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "imgSrc",
      header: "",
      cell: ({ row }) => {
        return (
          <img
            className='rounded'
            src={row.original.imgSrc}
            alt={`${row.original.product} image`}
            width={100}
            height={100}
          />
        )
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

import { AppSkeleton } from "@/components/app/app-skeleton"
import { DatePicker } from "@/components/date-picker/date-picker"
import { Container } from "@/components/ui/container"
import { purchaseMessages } from "@/messages/purchases"
import { createFileRoute, ErrorComponent, retainSearchParams } from "@tanstack/react-router"
import { fallback, zodSearchValidator } from '@tanstack/router-zod-adapter'
import { isAfter, isBefore, subDays } from "date-fns"
import { toast } from "sonner"
import { z } from "zod"

const SearchSchema = z.object({
  from: fallback(z.string().datetime().optional(), subDays(new Date(), 7).toISOString()).default(subDays(new Date(), 7).toISOString()),
  to: fallback(z.string().datetime().optional(), new Date().toISOString()).default(new Date().toISOString()),
})

// TODO: Date <-> ISOString 변환 처리를 middleware로 처리하기
export const Route = createFileRoute('/')({
  component: RouteComponent,
  pendingComponent: AppSkeleton,
  errorComponent: ErrorComponent,
  validateSearch: zodSearchValidator(SearchSchema),
  search: {
    middlewares: [retainSearchParams(['from', 'to'])],
  },
  loaderDeps: ({ search }) => ({
    from: search.from,
    to: search.to,
  }),
  loader: async ({ deps }) => {
    const response = await purchaseMessages.getPurchaseFrequency({
      from: deps.from,
      to: deps.to,
    })

    return response
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { from, to } = Route.useSearch({
    select: (search) => ({
      from: search.from,
      to: search.to,
    }),
  })
  const data = Route.useLoaderData()

  return (
    <Container>
      <h1>Frequency</h1>
      <section className="flex gap-4 py-4">
        <DatePicker
          value={new Date(from)}
          onChange={(date) => {
            if (date != null) {
              if (to != null && isAfter(date, to)) {
                toast.error('from 날짜는 to 날짜보다 늦을 수 없습니다.')
              } else {
                navigate({ search: { from: date.toISOString() } })
              }
            }
          }}
        />
        <span>-</span>
        <DatePicker
          value={new Date(to)}
          onChange={(date) => {
            if (date != null) {
              if (from != null && isBefore(date, from)) {
                toast.error('to 날짜는 from 날짜보다 이전일 수 없습니다.')
              } else {
                navigate({ search: { to: date.toISOString() } })
              }
            }
          }}
        />
      </section>
      <section>
        Frequency: {JSON.stringify(data)}
      </section>
    </Container>
  )
}

import { AppSkeleton } from "@/components/app/app-skeleton"
import { DatePicker } from "@/components/date-picker/date-picker"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Container } from "@/components/ui/container"
import { purchaseMessages } from "@/messages/purchases"
import { createFileRoute, ErrorComponent, retainSearchParams } from "@tanstack/react-router"
import { fallback, zodSearchValidator } from '@tanstack/router-zod-adapter'
import { isAfter, isBefore, subDays } from "date-fns"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

const BASE_DATE = new Date(2024, 7, 1)
const SearchSchema = z.object({
  from: fallback(z.string().datetime().optional(), subDays(BASE_DATE, 7).toISOString()).default(subDays(BASE_DATE, 30).toISOString()),
  to: fallback(z.string().datetime().optional(), BASE_DATE.toISOString()).default(BASE_DATE.toISOString()),
})

// TODO: refactor) Date <-> ISOString 변환 처리를 middleware로 처리하기
// TODO: refactor) DateRangePicker로 분리
// TODO: enhancement) 최근 조회한 기간으로 조회할 수 있도록 버튼 구현
// TODO: enhancement) 차트 데이터에 지난 기간 데이터 포함시켜서 비교할 수 있도록 하기
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
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Frequency</h1>
      <section className="pb-4">
        <div className="flex gap-4 py-2 items-center">
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
          <span>→</span>
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
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigate({ search: { from: subDays(new Date(), 30).toISOString(), to: new Date().toISOString() } })
          }}
        >
          최근 한달
        </Button>
      </section>
      <section>
        <ChartContainer
          config={{
            count: { color: '#123123' },
          }}
          className="h-[320px] w-full"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid />
            <XAxis
              dataKey="range"
              tickMargin={10}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#123123" radius={4} />
          </BarChart>
        </ChartContainer>
      </section>
    </Container>
  )
}

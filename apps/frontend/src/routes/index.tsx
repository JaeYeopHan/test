import { AppSkeleton } from "@/components/app/app-skeleton"
import { DatePicker } from "@/components/date-picker/date-picker"
import { Container } from "@/components/ui/container"
import { purchaseMessages } from "@/messages/purchases"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/')({
  component: RouteComponent,
  pendingComponent: AppSkeleton,
  loader: async () => {
    const res = await purchaseMessages.getPurchaseFrequency({
      from: '2024-01-01',
      to: '2024-01-31',
    })

    return res
  } 
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return (
    <Container>
      <h1>Frequency</h1>
      <DatePicker value={undefined} onChange={() => {}} />
      <section>
        Frequency: {JSON.stringify(data)}
      </section>
    </Container>
  )
}

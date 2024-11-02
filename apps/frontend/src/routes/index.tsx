import { AppSkeleton } from "@/components/app/app-skeleton"
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
      Frequency: {JSON.stringify(data)}
    </Container>
  )
}

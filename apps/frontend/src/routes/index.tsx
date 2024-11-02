import { AppSkeleton } from "@/components/app/app-skeleton"
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
  return <div className="p-2">Frequency: {JSON.stringify(data)}</div>
}

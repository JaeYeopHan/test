import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="p-2">Users</div>
}

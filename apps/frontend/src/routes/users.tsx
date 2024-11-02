import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Container>
      <H1>Users</H1>
    </Container>
  )
}

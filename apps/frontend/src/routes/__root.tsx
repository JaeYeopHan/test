import { AppLayout } from "@/app/app-layout";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools';


export const Route = createRootRoute({
  component: () => (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <TanStackRouterDevtools />
    </>
  ),
})
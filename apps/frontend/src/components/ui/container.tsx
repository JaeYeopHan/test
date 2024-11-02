import { AppBreadcrumb } from "../app/app-breadcrumb";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto px-12 py-2">
      <AppBreadcrumb className="mb-2" />
      {children}
    </section>
  )
}

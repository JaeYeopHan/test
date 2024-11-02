import { AppBreadcrumb } from "../app/app-breadcrumb";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-12">
      <AppBreadcrumb />
      {children}
    </div>
  )
}

import { AppBreadcrumb } from "../app/app-breadcrumb";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto px-12 py-2">
      <AppBreadcrumb />
      {children}
    </div>
  )
}

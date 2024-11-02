import { Skeleton } from "../ui/skeleton";

export function AppSkeleton() {
  return (
    <section className="mx-auto px-12 py-2">
      <Skeleton className="h-4 w-[120px] mb-2" />
      <Skeleton className="h-4 w-[320px] mb-2" />
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[425px] w-[640px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[640px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      </div>
    </section>
  )
}

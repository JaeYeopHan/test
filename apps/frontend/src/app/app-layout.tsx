import { AppSidebar } from "@/app/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
 
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

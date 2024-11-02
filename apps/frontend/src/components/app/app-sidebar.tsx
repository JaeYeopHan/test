import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { BotIcon, ChevronDown, HelpCircleIcon, MessageCircleIcon, UserIcon } from "lucide-react"
import { ComponentProps } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <h2 className="text-2xl font-bold mt-2">Datarize</h2>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <AppSidebar.Item icon={<BotIcon className="w-4 h-4" />} to="/">Frequency</AppSidebar.Item>
              <AppSidebar.Item icon={<UserIcon className="w-4 h-4" />} to="/users">Users</AppSidebar.Item>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Help
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AppSidebar.Item icon={<MessageCircleIcon className="w-4 h-4" />} to="/" disabled>Feedback</AppSidebar.Item>
                  <AppSidebar.Item icon={<HelpCircleIcon className="w-4 h-4" />} to="/" disabled>Support</AppSidebar.Item>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

AppSidebar.Item = function SidebarItem({ children, icon, to, disabled }: { children: React.ReactNode, icon?: React.ReactNode, to: ComponentProps<typeof Link>['to'], disabled?: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link to={to} activeOptions={{ exact: true }} disabled={disabled}>
          {({ isActive }) => {
            return (
              <>
                {icon}
                <span className={cn({ 'font-bold': disabled ? false : isActive })}>{children}</span>
              </>
            )
          }}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

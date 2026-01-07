import { AppSidebar } from "@/components/app-sidebar"
import AuthunticateUser from "@/components/authunticateUser"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import SiteHeader from "@/components/site-header"

export default function ModuleLayout({ children }) {
  return (
    <AuthunticateUser>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 px-4 py-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthunticateUser>
  )
}

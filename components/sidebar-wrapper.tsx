"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login";

  return (
    <SidebarProvider>
      {!hideSidebar && <AppSidebar />}
      
        {!hideSidebar && <SidebarTrigger />}
        {children}
      
    </SidebarProvider>
  );
}

"use client";

import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useUserStore } from "@/src/store/useUserStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { proyecciones } = useUserStore();

  return (
    <SidebarProvider>
      <AppSidebar proyecciones={proyecciones} />
      <main className="flex-1 w-full overflow-x-hidden">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import "../globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="absolute">
      <AppSidebar />
      <main className="w-full overflow-x-hidden h-screen flex flex-col">
        <SidebarTrigger className="mt-2 ml-2" />
        {children}
      </main>
    </SidebarProvider>
  );
}

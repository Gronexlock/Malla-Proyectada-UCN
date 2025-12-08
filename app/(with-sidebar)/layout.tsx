import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
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
      <main className="w-full overflow-x-hidden h-screen flex flex-col bg-gradient-to-b from-sky-50 to-sky-200 dark:from-zinc-950 dark:to-slate-950">
        <SidebarTrigger className="m-2 bg-zinc-50 shadow hover:zinc-200 dark:hover:bg-zinc-700 hover:cursor-pointer border dark:bg-zinc-800 rounded-full p-4" />
        {children}
        <Toaster position="top-center" />
      </main>
    </SidebarProvider>
  );
}

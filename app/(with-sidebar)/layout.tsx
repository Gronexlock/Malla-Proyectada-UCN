import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import { getUser } from "@/src/actions/cookiesActions";
import { Geist} from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const { selectedCarrera } = await getUser();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex-1 w-full overflow-x-hidden">
        <SidebarTrigger />
        <header className="site-header">
          <div className="container flex items-center justify-center">
            {selectedCarrera?.nombre === "ITI" && (
              <h1 className={`${geistSans.className} text-2xl font-semibold`}>
                Ingeniería en Tecnologías de Información</h1>
            )}
            {selectedCarrera?.nombre === "ICI" && (
              <h1 className={`${geistSans.className} text-2xl font-semibold`}>
                Ingeniería Civil Industrial</h1>
            )}
            {selectedCarrera?.nombre === "ICCI" && (
              <h1 className={`${geistSans.className} text-2xl font-semibold`}>
                Ingeniería Civil en Computación e Informática</h1>
            )}
            {!selectedCarrera && 
              <h1 className={`${geistSans.className} text-2xl font-semibold`}>
                Carrera no definida</h1>}
          </div>
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}

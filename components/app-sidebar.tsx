import { Calendar, NotebookPen, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import LogoutButton from "./logout-button";
import Link from "next/link";
import CarreraSelect from "./carrera-select";

const items = [
  {
    title: "Mallas",
    icon: Calendar,
    subitems: [
      { title: "ICI", url: "/mallas/ici" },
      { title: "ICCI", url: "/mallas/icci" },
      { title: "ITI", url: "/mallas/iti" },
    ],
  },
  {
    title: "Proyecciones",
    icon: NotebookPen,
    subitems: [
      {
        title: "Crear proyección",
        url: "/proyecciones/nueva",
      },
      { title: "Mis proyecciones", url: "/proyecciones" },
    ],
  },
  {
    title: "Estudiante",
    icon: User,
    subitems: [
      { title: "Mi avance curricular", url: "/estudiante/avance" },
      { title: "Mi avance cronológico", url: "/estudiante/avance-cronologico" },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <span className="text-base font-semibold">
                  Proyección Curricular
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="pb-4">
                <CarreraSelect />
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <span>
                      <item.icon />
                      <span>{item.title}</span>
                    </span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.subitems.map((subitem) => (
                      <SidebarMenuItem key={subitem.title}>
                        <SidebarMenuButton asChild>
                          <Link href={subitem.url}>{subitem.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}

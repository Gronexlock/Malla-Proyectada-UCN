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

const items = [
  {
    title: "Mallas",
    icon: Calendar,
    subitems: [
      { title: "ICI", url: "/mallas/iti" },
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
    subitems: [{ title: "Mi avance curricular", url: "/estudiante/avance" }],
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
                  Proyección de Avance
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

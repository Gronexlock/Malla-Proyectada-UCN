import { Calendar, ChevronRight, NotebookPen, User } from "lucide-react";

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
import { Proyeccion } from "@/src/types/proyeccion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

const items = [
  {
    title: "Mallas",
    icon: Calendar,
    subitems: [
      { title: "ICCI", url: "/mallas/icci" },
      { title: "ICI", url: "/mallas/ici" },
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
      {
        title: "Mis proyecciones",
        url: "/proyecciones",
      },
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

type AppSidebarProps = {
  proyecciones: Proyeccion[];
};

export function AppSidebar({ proyecciones }: AppSidebarProps) {
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
                <Collapsible
                  key={item.title}
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarMenuItem key={item.title}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton asChild>
                        <span>
                          <item.icon />
                          {item.title}
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subitems.map((subitem) => (
                          <SidebarMenuItem key={subitem.title}>
                            <SidebarMenuButton asChild>
                              <Link href={subitem.url}>{subitem.title}</Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
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

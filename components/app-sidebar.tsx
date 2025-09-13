import { Calendar, Home, Inbox, ChevronDown} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"



// Menu items.
const items = [
  {
    title: "Mallas",
    url: "#",
    icon: Home,
    subItems: [
      { title: "ICI", url: "#" },
      { title: "ICCI", url: "#" },
      { title: "ITI", url: "#" },
    ],
  },
  {
    title: "Proyecciones",
    url: "#",
    icon: Inbox,
    subItems: [
      { title: "Mis Proyecciones", url: "#" },
      { title: "Crear Proyecciones", url: "#" },
    ],
  },
  {
    title: "Estudiante",
    url: "#",
    icon: Calendar,
    subItems: [
      { title: "Datos", url: "#" },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar style={{
        backgroundColor: "hsl(240, 5.9%, 10%)",
        color: "white",
    }}>
      <SidebarContent style={{
        backgroundColor: "hsl(240, 5.9%, 10%)",
        color: "white",
      }}>
        <SidebarGroup>
          <SidebarGroupLabel style={{
            color: "white",
          }}>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                item.subItems ? (
                  <SidebarMenuItem key={item.title}>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between w-full">
                          <span className="flex items-center gap-2">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.title}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-6 flex flex-col gap-2">
                        {item.subItems.map((sub) => (
                          <a key={sub.title} href={sub.url} className="text-sm text-gray-300 hover:text-white">
                            {sub.title}
                          </a>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
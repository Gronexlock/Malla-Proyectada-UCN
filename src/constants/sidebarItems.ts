import { Calendar, NotebookPen, User } from "lucide-react";
import { User as UserType } from "../schemas/userSchema";

export const items = [
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
      { title: "Alternar carrera", url: "/estudiante/alternar-carrera" },
      { title: "Mi avance curricular", url: "/estudiante/avance" },
      { title: "Mi avance cronológico", url: "/estudiante/avance-cronologico" },
    ],
  },
];

/**
 * Obtiene los items de la sidebar. Si el estudiante tiene solo una carrera,
 * el item "Alternar carrera" se omite.
 * @param user El usuario del estudiante.
 * @returns La lista de items de la sidebar.
 */
export function getSidebarItems(user: UserType) {
  if (user.carreras.length > 1) return items;
  return items.map((item) => {
    if (item.title === "Estudiante") {
      return {
        ...item,
        subitems: item.subitems.filter(
          (subitem) => subitem.title !== "Alternar carrera"
        ),
      };
    }
    return item;
  });
}

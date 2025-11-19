import { Calendar, NotebookPen, User } from "lucide-react";

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
      { title: "Mi avance curricular", url: "/estudiante/avance" },
      { title: "Mi avance cronológico", url: "/estudiante/avance-cronologico" },
    ],
  },
];

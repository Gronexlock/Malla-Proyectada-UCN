import { CircleCheckBig, CircleX, Clock4, Lock } from "lucide-react";
import { CursoStatus } from "../types/curso";

export const statusStyles: Record<
  CursoStatus,
  { class: string; icon: React.ComponentType<any> }
> = {
  [CursoStatus.APROBADO]: {
    class: [
      "dark:bg-emerald-500/20 dark:border-emerald-500/50 dark:text-emerald-400",
      "bg-emerald-500/40 border-emerald-500/70 text-emerald-700",
    ].join(" "),
    icon: CircleCheckBig,
  },
  [CursoStatus.PENDIENTE]: {
    class: [
      "dark:bg-blue-500/20 dark:border-blue-500/50 dark:text-blue-400",
      "bg-blue-500/40 border-blue-500/70 text-blue-700",
    ].join(" "),
    icon: Clock4,
  },
  [CursoStatus.REPROBADO]: {
    class: [
      "dark:bg-red-500/20 dark:border-red-500/50 dark:text-red-400",
      "bg-red-500/40 border-red-500/70 text-red-700",
    ].join(" "),
    icon: CircleX,
  },
  [CursoStatus.INSCRITO]: {
    class: [
      "dark:bg-blue-500/20 dark:border-blue-500/50 dark:text-blue-400",
      "bg-blue-500/40 border-blue-500/70 text-blue-700",
    ].join(" "),
    icon: Clock4,
  },
  [CursoStatus.INSCRITO_MALLA]: {
    class: [
      "dark:bg-yellow-500/20 dark:border-yellow-500/50 dark:text-yellow-400",
      "bg-yellow-500/40 border-yellow-500/70 text-yellow-700",
    ].join(" "),
    icon: Clock4,
  },
  [CursoStatus.BLOQUEADO]: {
    class: [
      "dark:bg-orange-500/20 dark:border-orange-500/50 dark:text-orange-400",
      "bg-orange-500/40 border-orange-500/70 text-orange-700",
    ].join(" "),
    icon: Lock,
  },
};

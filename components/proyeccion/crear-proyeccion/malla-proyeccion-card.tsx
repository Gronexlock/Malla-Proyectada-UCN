import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useProyeccion } from "@/src/contexts/ProyeccionContext";
import { Curso, CursoStatus } from "@/src/types/curso";
import { getCursoStatus } from "@/src/utils/cursosUtils";
import { CircleCheckBig, CircleX, Clock4, Lock, XCircle } from "lucide-react";

type MallaProyeccionCardProps = {
  curso: Curso;
  onCursoClick: (curso: Curso) => void;
  disperso: boolean;
  cursosBloqueantes: Curso[];
};

const statusStyles: Record<
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
  [CursoStatus.BLOQUEADO]: {
    class: [
      "dark:bg-orange-500/20 dark:border-orange-500/50 dark:text-orange-400",
      "bg-orange-500/40 border-orange-500/70 text-orange-700",
    ].join(" "),
    icon: Lock,
  },
};

export default function MallaProyeccionCard({
  curso,
  onCursoClick,
  disperso,
  cursosBloqueantes,
}: MallaProyeccionCardProps) {
  const { ignorarRestricciones } = useProyeccion();

  const estaBloqueado = cursosBloqueantes.length > 0 || disperso;
  const statusReal = getCursoStatus(curso);
  const status = estaBloqueado ? CursoStatus.BLOQUEADO : statusReal;

  const isInscrito = statusReal === CursoStatus.INSCRITO;
  const isAprobado = statusReal === CursoStatus.APROBADO;

  const isClickable =
    statusReal !== CursoStatus.APROBADO &&
    (!estaBloqueado || ignorarRestricciones);

  const IconComponent = statusStyles[status].icon;

  const cardContent = (
    <div
      key={curso.codigo}
      className={cn(
        `flex flex-col p-2 rounded-lg border min-w-36 ${statusStyles[status].class}`,
        isInscrito && "ring-2 dark:ring-blue-500",
        isClickable
          ? "hover:scale-[1.02] transition-all cursor-pointer"
          : "opacity-80",
        !isClickable && !isAprobado && "cursor-not-allowed"
      )}
      onClick={() => isClickable && onCursoClick(curso)}
    >
      <div className="flex justify-between">
        <p className="opacity-70 font-mono text-[11px]">{curso.codigo}</p>
        <IconComponent size={13} />
      </div>
      <p className="text-sm text-foreground truncate">{curso.asignatura}</p>
      <span className="text-[11px] opacity-70 mt-1">{curso.creditos} SCT</span>
    </div>
  );

  if (cursosBloqueantes.length > 0) {
    return (
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="font-semibold text-xs mb-1">Requisitos pendientes:</p>
          <ul className="text-xs space-y-0.5">
            {cursosBloqueantes.map((prereq) => (
              <li key={prereq.codigo} className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-orange-700" />
                {prereq.asignatura}
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (disperso) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="font-semibold text-xs mb-1">Dispersión:</p>
          <p className="text-xs space-y-0.5 flex gap-1 items-center">
            <XCircle className="h-3 w-3 text-orange-700" /> Debes tener todo
            aprobado hasta el nivel {curso.nivel - 2}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return cardContent;
}

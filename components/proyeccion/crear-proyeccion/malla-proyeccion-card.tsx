import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Curso, CursoStatus } from "@/src/types/curso";
import { getCursoStatus } from "@/src/utils/cursosUtils";
import { CircleCheckBig, CircleX, Clock4, Lock, XCircle } from "lucide-react";

type MallaProyeccionCardProps = {
  curso: Curso;
  onCursoClick: (curso: Curso) => void;
  disperso: boolean;
  cursosBloqueantes: Curso[];
  ignorarRestricciones?: boolean;
};

const statusStyles: Record<
  CursoStatus,
  { class: string; icon: React.ComponentType<any> }
> = {
  [CursoStatus.APROBADO]: {
    class: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
    icon: CircleCheckBig,
  },
  [CursoStatus.PENDIENTE]: {
    class: "bg-blue-500/20 border-blue-500/50 text-blue-400",
    icon: Clock4,
  },
  [CursoStatus.REPROBADO]: {
    class: "bg-red-500/20 border-red-500/50 text-red-400",
    icon: CircleX,
  },
  [CursoStatus.INSCRITO]: {
    class:
      "bg-blue-500/20 border-blue-500/50 text-blue-400 ring-2 ring-green-500",
    icon: Clock4,
  },
  [CursoStatus.BLOQUEADO]: {
    class:
      "bg-orange-500/20 border-orange-500/50 text-orange-400 cursor-not-allowed",
    icon: Lock,
  },
};

export default function MallaProyeccionCard({
  curso,
  onCursoClick,
  disperso,
  cursosBloqueantes,
  ignorarRestricciones,
}: MallaProyeccionCardProps) {
  const estaBloqueado = cursosBloqueantes.length > 0 || disperso;
  const status = estaBloqueado ? CursoStatus.BLOQUEADO : getCursoStatus(curso);
  const isClickable = status !== CursoStatus.APROBADO && !estaBloqueado;
  const IconComponent = statusStyles[status].icon;

  const cardContent = (
    <div
      key={curso.codigo}
      className={cn(
        `flex flex-col p-2 rounded-lg border min-w-36 ${statusStyles[status].class}`,
        isClickable
          ? "hover:scale-[1.02] transition-all cursor-pointer"
          : "opacity-80"
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

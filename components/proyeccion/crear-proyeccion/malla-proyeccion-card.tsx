import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { statusStyles } from "@/src/constants/statusStyles";
import { Curso, CursoStatus } from "@/src/types/curso";
import { getCursoStatus } from "@/src/utils/cursosUtils";
import { XCircle } from "lucide-react";

type MallaProyeccionCardProps = {
  curso: Curso;
  onCursoClick: (curso: Curso) => void;
  disperso: boolean;
  cursosBloqueantes: Curso[];
  ignorarRestricciones: boolean;
};

export default function MallaProyeccionCard({
  curso,
  onCursoClick,
  disperso,
  cursosBloqueantes,
  ignorarRestricciones,
}: MallaProyeccionCardProps) {
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
        `flex flex-col p-2 rounded-lg border min-w-36 shadow-md ${statusStyles[status].class}`,
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
      <p className="text-xs text-foreground truncate">{curso.asignatura}</p>
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

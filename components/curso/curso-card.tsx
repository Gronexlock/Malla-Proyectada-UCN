import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { statusStyles } from "@/src/constants/statusStyles";
import { Curso, CursoStatus } from "@/src/types/curso";
import { getCursoStatus } from "@/src/utils/cursosUtils";

type CursoCardProps = {
  curso: Curso;
};

export default function CursoCard({ curso }: CursoCardProps) {
  const status =
    getCursoStatus(curso) === CursoStatus.INSCRITO
      ? CursoStatus.INSCRITO_MALLA
      : getCursoStatus(curso);

  const cardContent = (
    <div
      key={curso.codigo}
      className={cn(
        `flex flex-col p-2 rounded-lg border shadow-md bg-muted w-40 h-23 justify-center`,
        curso.codigo === "ECIN-01000" && "h-full justify-center items-center",
        status !== CursoStatus.PENDIENTE && statusStyles[status].class
      )}
    >
      <div className="flex justify-between gap-2">
        <p className="opacity-70 font-mono text-[11px]">{curso.codigo}</p>
      </div>
      <p className="text-sm text-foreground text-wrap">{curso.asignatura}</p>
      <span className="text-[11px] opacity-70 mt-1">{curso.creditos} SCT</span>
    </div>
  );

  if (curso.prerrequisitos.length > 0) {
    return (
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="font-semibold text-xs mb-1">Prerrequisitos:</p>
          <ul className="text-xs space-y-0.5">
            {curso.prerrequisitos.map((prereq) =>
              prereq.asignatura ? (
                <li key={prereq.codigo} className="flex items-center gap-1">
                  {prereq.asignatura}
                </li>
              ) : null
            )}
          </ul>
        </TooltipContent>
      </Tooltip>
    );
  }

  return cardContent;
}

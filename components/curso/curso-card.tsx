import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Curso } from "@/src/types/curso";

type CursoCardProps = {
  curso: Curso;
  prerrequisitos: Curso[];
};

export default function CursoCard({ curso, prerrequisitos }: CursoCardProps) {
  const cardContent = (
    <div
      key={curso.codigo}
      className={cn(
        `flex flex-col p-2 rounded-lg border min-w-36 bg-muted`,
        curso.codigo === "ECIN-01000" && "h-full justify-center items-center"
      )}
    >
      <div className="flex justify-between">
        <p className="opacity-70 font-mono text-[11px]">{curso.codigo}</p>
      </div>
      <p className="text-sm text-foreground">{curso.asignatura}</p>
      <span className="text-[11px] opacity-70 mt-1">{curso.creditos} SCT</span>
    </div>
  );

  if (prerrequisitos.length > 0) {
    return (
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="font-semibold text-xs mb-1">Prerrequisitos:</p>
          <ul className="text-xs space-y-0.5">
            {prerrequisitos.map((prereq) =>
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

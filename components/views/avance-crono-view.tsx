import { Curso } from "@/src/types/curso";
import { getCursosPorPeriodo } from "@/src/utils/cursosUtils";
import { formatPeriod } from "@/src/utils/semestreUtils";
import CursoCard from "../curso/curso-card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type AvanceCronoViewProps = {
  cursos: Curso[];
};

export function AvanceCronoView({ cursos }: AvanceCronoViewProps) {
  const cursosPorSemestre = getCursosPorPeriodo(cursos);

  return (
    <div className="w-full whitespace-nowrap h-full flex flex-col items-center">
      <div className="flex flex-col items-center max-h-full max-w-full">
        <div className="flex flex-col pb-4 w-full">
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className="size-3 bg-emerald-500/70 dark:bg-emerald-500/50 rounded-full"></div>
              <p className="text-xs text-muted-foreground">Aprobado</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-3 bg-red-500/70 dark:bg-red-500/50 rounded-full"></div>
              <p className="text-xs text-muted-foreground">Reprobado</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-3 bg-yellow-500/70 dark:bg-yellow-500/50 rounded-full"></div>
              <p className="text-xs text-muted-foreground">Inscrito</p>
            </div>
          </div>
        </div>
        <div className="pb-6 pr-6 min-h-0 min-w-0 max-w-full flex-1">
          <ScrollArea className="w-full h-full pr-2">
            <div className="min-w-max flex flex-col">
              <div className="flex gap-4 sticky top-0 z-10 bg-background pb-4">
                {Object.keys(cursosPorSemestre)
                  .sort((a, b) => Number(a) - Number(b))
                  .map((semestre) => (
                    <div
                      className="rounded flex justify-center items-center bg-muted p-1 w-40 shadow-sm border"
                      key={`header-${semestre}`}
                    >
                      <h2 className="text-center font-semibold">
                        {formatPeriod(semestre)}
                      </h2>
                    </div>
                  ))}
              </div>
              <div className="flex gap-4 min-h-0">
                {Object.keys(cursosPorSemestre)
                  .sort((a, b) => Number(a) - Number(b))
                  .map((semestre) => (
                    <div className="flex flex-col gap-4 pb-2" key={semestre}>
                      {cursosPorSemestre[semestre].map((curso) => (
                        <CursoCard key={curso.nrc} curso={curso} />
                      ))}
                    </div>
                  ))}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

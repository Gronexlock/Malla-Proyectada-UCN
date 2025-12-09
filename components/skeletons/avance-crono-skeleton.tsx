import { PageTitle } from "../page-title";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

export function AvanceCronoSkeleton() {
  const cursosPorSemestre = Array.from({ length: 6 }, (_, idx) => {
    return {
      semestre: idx + 1,
      cursos: Array.from({ length: 7 }, (_, j) => ({
        codigo: `skeleton-${idx + 1}-${j}`,
      })),
    };
  });

  return (
    <div className="w-full whitespace-nowrap h-full flex flex-col items-center">
      <div className="flex flex-col items-center max-h-full max-w-full">
        <div className="flex flex-col pb-4 w-full gap-2">
          <PageTitle title="Avance Cronológico" />
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
              <div className="flex gap-4 sticky top-0 z-10 pb-4">
                {cursosPorSemestre.map(({ semestre }) => (
                  <div
                    className="rounded flex justify-center items-center bg-muted p-1 w-40 shadow-sm border"
                    key={semestre}
                  >
                    <h2 className="text-center font-semibold">&nbsp;</h2>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 min-h-0">
                {cursosPorSemestre.map(({ semestre, cursos }) => (
                  <div className="flex flex-col gap-4 pb-2" key={semestre}>
                    {cursos.map((curso) => (
                      <Skeleton
                        key={curso.codigo}
                        className="rounded-lg w-40 shadow-md border h-23"
                      />
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

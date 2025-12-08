import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

export function ProyeccionViewSkeleton() {
  const proyeccion = Array.from({ length: 6 }, (_, i) => {
    const isLast = i === 5;
    return {
      semestre: `Semestre ${i + 1}`,
      cursos: Array.from({ length: isLast ? 1 : 6 }, (_, j) => ({
        codigo: `CURSO${i + 1}${j + 1}`,
      })),
    };
  });
  const lastSemestre = proyeccion[proyeccion.length - 1];

  return (
    <div className="w-full whitespace-nowrap h-full flex flex-col items-center">
      <div className="flex flex-col items-center max-h-full max-w-full">
        <div className="flex flex-col pb-4 w-full mb-2">
          <div className="flex gap-2">
            <Skeleton className="shadow-xs text-[13px] font-medium border border-zinc-300 dark:border-zinc-700 px-2 rounded-md text-transparent">
              000 SCT / 0 sem.
            </Skeleton>
          </div>
        </div>
        <div className="pb-6 pr-6 min-h-0 min-w-0 max-w-full flex-1">
          <ScrollArea className="w-full h-full pr-2">
            <div className="min-w-max flex flex-col">
              <div className="flex gap-4 sticky top-0 z-10 bg-background pb-4">
                {proyeccion.map((semestre) => (
                  <div
                    key={semestre.semestre}
                    className="flex justify-between items-center gap-2 border-b border-zinc-300 dark:border-zinc-700 pb-2 w-full"
                  >
                    <Skeleton className="h-5 px-2 rounded-full bg-emerald-500/30 dark:bg-green-500/20 flex items-center justify-center">
                      <div className="text-[11px] font-semibold text-transparent">
                        {semestre.semestre}
                      </div>
                    </Skeleton>
                    <Skeleton className="flex bg-secondary h-5 px-2 items-center justify-center rounded-full">
                      <span className="text-[10px] font-semibold text-transparent">
                        00 SCT
                      </span>
                    </Skeleton>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 min-h-0">
                {proyeccion.map((semestre) => (
                  <div
                    className="flex flex-col gap-4 pb-2"
                    key={semestre.semestre}
                  >
                    {semestre.cursos.map((curso) => (
                      <Skeleton
                        key={curso.codigo}
                        className={cn(
                          "w-40",
                          semestre === lastSemestre ? "h-full" : "h-23"
                        )}
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

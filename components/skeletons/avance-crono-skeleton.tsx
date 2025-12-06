import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

export function AvanceCronoSkeleton() {
  const niveles = Array.from({ length: 6 }, (_, idx) => {
    return {
      nivel: idx + 1,
      cursos: Array.from({ length: 7 }, (_, j) => ({
        codigo: `skeleton-${idx + 1}-${j}`,
      })),
    };
  });

  return (
    <ScrollArea className={`w-full whitespace-nowrap pb-8`}>
      <div className="flex flex-col items-center">
        <div className="flex flex-col w-fit gap-4">
          {/* Leyenda de colores */}
          <div className="flex justify-between">
            <div className="flex flex-col min-w-max">
              <div className="flex gap-2 ">
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
          </div>
          <div className="flex justify-center gap-4">
            {niveles.map(({ nivel, cursos }) => (
              <div key={nivel} className="flex flex-col gap-4">
                <Skeleton
                  className={`rounded flex justify-center items-center p-1 bg-muted`}
                >
                  <h2 className="text-center font-semibold">&nbsp;</h2>
                </Skeleton>
                {cursos.map((course) => {
                  return (
                    <Skeleton
                      key={course.codigo}
                      className={cn(
                        "rounded-lg w-40",
                        course.codigo === "last" ? "h-full" : "h-23"
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

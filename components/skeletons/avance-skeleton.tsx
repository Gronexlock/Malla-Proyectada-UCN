import { cn } from "@/lib/utils";
import { colors } from "@/src/constants/mallaStyles";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { Carrera } from "@/src/types/carrera";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

type AvanceSkeletonProps = {
  carrera: Carrera;
};

export function AvanceSkeleton({ carrera }: AvanceSkeletonProps) {
  const colorConfig = colors[carrera.codigo];
  const niveles = Array.from({ length: colorConfig.totalLevels }, (_, idx) => {
    const isLast = idx === colorConfig.totalLevels - 1;
    return {
      nivel: idx + 1,
      cursos: isLast
        ? [{ codigo: `last` }]
        : Array.from({ length: colorConfig.coursesPerLevel }, (_, j) => ({
            codigo: `skeleton-${idx + 1}-${j}`,
          })),
    };
  });

  return (
    <ScrollArea className={`w-full whitespace-nowrap`}>
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
                <div className="flex items-center gap-1">
                  <div className="size-3 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                  <p className="text-xs text-muted-foreground">Pendiente</p>
                </div>
              </div>
            </div>
            {/* Porcentaje de avance */}
            <Skeleton className="text-[13px] font-medium border border-zinc-300 dark:border-zinc-700 px-2 rounded-md shadow-xs">
              0% avance
            </Skeleton>
          </div>
          <div className="flex justify-center gap-4">
            {niveles.map(({ nivel, cursos }) => (
              <div key={nivel} className="flex flex-col gap-4 pb-2 ">
                <div
                  className={`rounded flex justify-center items-center p-1 bg-muted border shadow-sm`}
                >
                  <h2 className="text-center font-semibold">
                    {romanNumerals[Number(nivel)]}
                  </h2>
                </div>
                {cursos.map((course) => {
                  return (
                    <Skeleton
                      key={course.codigo}
                      className={cn(
                        "rounded-lg w-40 shadow-md border",
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

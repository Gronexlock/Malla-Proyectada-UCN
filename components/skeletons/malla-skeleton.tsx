import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { colors } from "@/src/constants/mallaStyles";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { Carrera } from "@/src/types/carrera";
import { getLevelColor } from "@/src/utils/mallaUtils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type MallaViewProps = {
  carrera: Carrera;
};

export function MallaSkeleton({ carrera }: MallaViewProps) {
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
      <div className="flex flex-col items-center min-w-max">
        <p
          className={`text-center text-3xl bg-gradient-to-r ${colorConfig.gradient} w-fit bg-clip-text text-transparent font-semibold mb-4`}
        >
          {carrera.nombre.toUpperCase()}
        </p>
        <div className="flex justify-center min-w-max gap-4">
          {niveles.map(({ nivel, cursos }) => (
            <div key={nivel} className="flex flex-col gap-4 pb-2">
              <div
                className="rounded flex justify-center items-center text-white p-1"
                style={{
                  backgroundColor: getLevelColor(
                    nivel,
                    colorConfig.totalLevels,
                    colorConfig.start,
                    colorConfig.end
                  ),
                }}
              >
                <h2 className="text-center font-semibold">
                  {romanNumerals[nivel]}
                </h2>
              </div>

              {cursos.map((course) => (
                <Skeleton
                  key={course.codigo}
                  className={cn(
                    "rounded-lg w-40 shadow-md border",
                    course.codigo === "last" ? "h-full" : "h-23"
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

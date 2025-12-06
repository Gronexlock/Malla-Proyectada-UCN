import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { Carrera } from "@/src/types/carrera";
import { getLevelColor } from "@/src/utils/mallaUtils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type MallaViewProps = {
  carrera: Carrera;
};

type carrerLevelInfo = {
  [key in Carrera["codigo"]]: {
    start: string;
    end: string;
    gradient: string;
    totalLevels: number;
    coursesPerLevel: number;
  };
};

const colors: carrerLevelInfo = {
  8266: {
    start: "hsl(121 30.7% 50.2%)",
    end: "hsl(121 44.3% 34.5%)",
    gradient:
      "dark:from-green-400 dark:to-green-500 from-green-500 to-green-600",
    totalLevels: 8,
    coursesPerLevel: 7,
  },
  8606: {
    start: "hsl(209 88.7% 54.9%)",
    end: "hsl(209 90.8% 33.9%)",
    gradient: "from-blue-400 to-blue-500",
    totalLevels: 10,
    coursesPerLevel: 7,
  },
  8616: {
    start: "hsl(18 87% 51.8%)",
    end: "hsl(18 61.1% 41.4%)",
    gradient: "from-orange-400 to-orange-500",
    totalLevels: 10,
    coursesPerLevel: 8,
  },
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
    <ScrollArea className={`w-full whitespace-nowrap pb-8`}>
      <div className="flex flex-col items-center min-w-max">
        <p
          className={`text-center text-3xl bg-gradient-to-r ${colorConfig.gradient} w-fit bg-clip-text text-transparent font-semibold mb-4`}
        >
          {carrera.nombre.toUpperCase()}
        </p>
        <div className="flex justify-center min-w-max gap-4">
          {niveles.map(({ nivel, cursos }) => (
            <div key={nivel} className="flex flex-col gap-6">
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
                    "rounded-lg w-40",
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

import { romanNumerals } from "@/src/constants/numerosRomanos";
import { Carrera } from "@/src/types/carrera";
import { Curso } from "@/src/types/curso";
import { getCursosPorNivel } from "@/src/utils/cursosUtils";
import { getLevelColor } from "@/src/utils/mallaUtils";
import CursoCard from "../curso/curso-card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type MallaViewProps = {
  cursos: Curso[];
  carrera: Carrera;
  className?: string;
};

type ColorConfig = {
  [key in Carrera["codigo"]]: {
    start: string;
    end: string;
    totalLevels: number;
  };
};

const colors: ColorConfig = {
  8266: {
    start: "hsl(121 30.7% 50.2%)",
    end: "hsl(121 44.3% 34.5%)",
    totalLevels: 8,
  },
  8606: {
    start: "hsl(209 88.7% 54.9%)",
    end: "hsl(209 90.8% 33.9%)",
    totalLevels: 10,
  },
  8616: {
    start: "hsl(18 87% 51.8%)",
    end: "hsl(18 61.1% 41.4%)",
    totalLevels: 10,
  },
};

export function MallaView({ cursos, carrera, className }: MallaViewProps) {
  const cursosPorNivel = getCursosPorNivel(cursos);
  const colorConfig = colors[carrera.codigo];

  return (
    <ScrollArea className={`w-full whitespace-nowrap ${className} pb-4`}>
      <div className="flex justify-center min-w-max gap-4">
        {Object.keys(cursosPorNivel)
          .sort((a, b) => Number(a) - Number(b))
          .map((nivel) => (
            <div key={nivel} className="flex flex-col gap-8">
              <div
                className={`rounded flex justify-center items-center text-white p-1`}
                style={{
                  backgroundColor: getLevelColor(
                    Number(nivel),
                    colorConfig.totalLevels as number,
                    colorConfig.start as string,
                    colorConfig.end as string
                  ),
                }}
              >
                <h2 className="text-center font-semibold">
                  {romanNumerals[Number(nivel)]}
                </h2>
              </div>

              {cursosPorNivel[Number(nivel)].map((course) => {
                return (
                  <CursoCard
                    key={course.codigo}
                    curso={course}
                    prerrequisitos={course.prerrequisitos}
                  />
                );
              })}
            </div>
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

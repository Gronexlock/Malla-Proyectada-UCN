import { CursoMalla } from "@/src/types/curso";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { CursosPorNivel, getCursosPorNivel } from "@/src/utils/curso";
import { CursoMallaCard } from "./curso-malla-card";
import { getColorForLevel, colorsByMajor } from "@/src/utils/malla";

type MallaViewProps = {
  cursos: CursoMalla[];
  codigoCarrera: keyof typeof colorsByMajor;
};

export function MallaView({ cursos, codigoCarrera }: MallaViewProps) {
  const cursosPorNivel: CursosPorNivel = getCursosPorNivel(cursos);
  const { start, end, totalNiveles } = colorsByMajor[codigoCarrera];

  return (
    <ScrollArea className="w-full whitespace-nowrap h-[calc(100vh-64px)]">
      <div className="flex justify-center min-w-max gap-4">
        {Object.keys(cursosPorNivel)
          .sort((a, b) => Number(a) - Number(b))
          .map((level) => (
            <div key={level} className="flex flex-col gap-8">
              <div
                className="bg-zinc-400 rounded-sm flex justify-center items-center p-2"
                style={{
                  backgroundColor: getColorForLevel(
                    start,
                    end,
                    Number(level),
                    totalNiveles
                  ),
                }}
              >
                <h2 className="text-center font-semibold text-white">
                  {romanNumerals[Number(level)]}
                </h2>
              </div>

              {cursosPorNivel[Number(level)].map((course) => (
                <CursoMallaCard key={course.codigo} {...course} />
              ))}
            </div>
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

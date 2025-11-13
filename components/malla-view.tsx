import { CursoMalla } from "@/src/types/curso";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { CursoMallaCard } from "./curso-malla-card";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { getCursosPorNivel } from "@/src/utils/malla";

type MallaViewProps = {
  cursos: CursoMalla[];
};

export function MallaView({ cursos }: MallaViewProps) {
  const cursosPorNivel = getCursosPorNivel(cursos);

  return (
    <ScrollArea className="w-full whitespace-nowrap h-[calc(100vh-64px)]">
      <div className="flex justify-center min-w-max gap-4">
        {Object.keys(cursosPorNivel)
          .sort((a, b) => Number(a) - Number(b))
          .map((nivel) => (
            <div key={nivel} className="flex flex-col gap-2">
              <div className="bg-zinc-400 rounded-sm flex justify-center items-center mb-2">
                <h2 className="text-center font-semibold">
                  {romanNumerals[Number(nivel)]}
                </h2>
              </div>

              {cursosPorNivel[Number(nivel)].map((course) => (
                <CursoMallaCard key={course.codigo} curso={course} />
              ))}
            </div>
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

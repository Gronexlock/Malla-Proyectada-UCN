import { romanNumerals } from "@/src/constants/numerosRomanos";
import { Curso } from "@/src/types/curso";
import { getCursosPorNivel } from "@/src/utils/cursosUtils";
import { CursoCard } from "../curso/curso-card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type AvanceViewProps = {
  cursos: Curso[];
};

export function AvanceView({ cursos }: AvanceViewProps) {
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

              {cursosPorNivel[Number(nivel)].map((curso) => (
                <CursoCard key={curso.codigo} curso={curso} />
              ))}
            </div>
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

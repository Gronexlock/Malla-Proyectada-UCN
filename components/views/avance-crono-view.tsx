import { Curso } from "@/src/types/curso";
import { getCursosPorPeriodo } from "@/src/utils/cursosUtils";
import { formatPeriod } from "@/src/utils/semestreUtils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import CursoCard from "../curso/curso-card";

type AvanceCronoViewProps = {
  cursos: Curso[];
};

export function AvanceCronoView({ cursos }: AvanceCronoViewProps) {
  const cursosPorSemestre = getCursosPorPeriodo(cursos);

  return (
    <ScrollArea className="w-full whitespace-nowrap h-[calc(100vh-64px)]">
      <div className="flex justify-center min-w-max gap-4 pb-6 pr-6">
        {Object.keys(cursosPorSemestre)
          .sort((a, b) => Number(a) - Number(b))
          .map((semestre) => (
            <div key={semestre} className="flex flex-col gap-2">
              <div className="bg-zinc-800 rounded-sm flex justify-center items-center mb-2">
                <h2 className="text-center text-white font-semibold">
                  {formatPeriod(semestre)}
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {cursosPorSemestre[semestre].map((curso) => (
                  <CursoCard key={curso.nrc} curso={curso} />
                ))}
              </div>
            </div>
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

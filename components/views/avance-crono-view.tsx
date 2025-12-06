import { Curso } from "@/src/types/curso";
import { getCursosPorPeriodo } from "@/src/utils/cursosUtils";
import { formatPeriod } from "@/src/utils/semestreUtils";
import CursoCard from "../curso/curso-card";

type AvanceCronoViewProps = {
  cursos: Curso[];
};

export function AvanceCronoView({ cursos }: AvanceCronoViewProps) {
  const cursosPorSemestre = getCursosPorPeriodo(cursos);

  return (
    <div className="w-full whitespace-nowrap overflow-scroll">
      <div className="flex flex-col min-w-max pb-4">
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
      <div className="flex justify-center min-w-max gap-4 pb-6 pr-6">
        {Object.keys(cursosPorSemestre)
          .sort((a, b) => Number(a) - Number(b))
          .map((semestre) => (
            <div key={semestre} className="flex flex-col gap-4">
              <div className="rounded flex justify-center items-center bg-muted p-1">
                <h2 className="text-center font-semibold">
                  {formatPeriod(semestre)}
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                {cursosPorSemestre[semestre].map((curso) => (
                  <CursoCard key={curso.nrc} curso={curso} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

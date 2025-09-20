import { CursoMalla } from "@/src/types/curso";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { CursoMallaCard } from "./curso-malla-card";
import { romanNumerals } from "@/src/constants/numerosRomanos";

type MallaViewProps = {
  cursos: CursoMalla[];
};

export function MallaView({ cursos }: MallaViewProps) {
  const cursosPorNivel: Record<number, CursoMalla[]> = {};
  cursos.forEach((curso) => {
    if (!cursosPorNivel[curso.nivel]) {
      cursosPorNivel[curso.nivel] = [];
    }
    cursosPorNivel[curso.nivel].push(curso);
  });

  const cursosPorAnio: Record<number, number[]> = {};
  Object.keys(cursosPorNivel).forEach((level) => {
    const anio = Math.ceil(Number(level) / 2);
    if (!cursosPorAnio[anio]) cursosPorAnio[anio] = [];
    cursosPorAnio[anio].push(Number(level));
  });

  return (
    <ScrollArea className="w-full whitespace-nowrap h-[calc(100vh-64px)]">
      <div className="flex justify-center min-w-max gap-4">
        {Object.keys(cursosPorAnio)
          .sort((a, b) => Number(a) - Number(b))
          .map((anio) => (
            <div key={anio} className="flex flex-col gap-2">
              <div className="rounded-sm text-center text-white font-bold mb-2 bg-zinc-800">
                Año {anio}
              </div>
              <div className="flex gap-4">
                {cursosPorAnio[Number(anio)].map((level) => (
                  <div key={level} className="flex flex-col gap-2">
                    <div className="bg-zinc-400 rounded-sm flex justify-center items-center mb-2">
                      <h2 className="text-center font-semibold">
                        {romanNumerals[level]}
                      </h2>
                    </div>

                    {cursosPorNivel[level].map((course) => (
                      <CursoMallaCard
                        key={course.codigo}
                        asignatura={course.asignatura}
                        codigo={course.codigo}
                        creditos={course.creditos}
                        nivel={course.nivel}
                        prereq={course.prereq}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

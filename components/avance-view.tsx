import { CursoAvance, CursoMalla } from "@/src/types/curso";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { CursoAvanceCard } from "./curso-avance-card";
import { getCursosPorNivel } from "@/src/utils/malla";

type AvanceViewProps = {
  cursos: CursoMalla[];
  avance: CursoAvance[];
};

export function AvanceView({ cursos, avance }: AvanceViewProps) {
  const cursosPorNivel = getCursosPorNivel(cursos);

  function getCursoStatus(codigo: string): CursoAvance["status"] | "PENDIENTE" {
    const cursoAvance = avance.filter((curso) => curso.course === codigo);
    if (cursoAvance.length === 0) return "PENDIENTE";
    if (cursoAvance.length === 1) return cursoAvance[0].status;
    else {
      const statuses = cursoAvance.map((curso) => curso.status);
      if (statuses.includes("APROBADO")) return "APROBADO";
      if (statuses.includes("INSCRITO")) return "INSCRITO";
      return "REPROBADO";
    }
  }

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
                <CursoAvanceCard
                  key={course.codigo}
                  asignatura={course.asignatura}
                  codigo={course.codigo}
                  creditos={course.creditos}
                  status={getCursoStatus(course.codigo)}
                  prereq={course.prereq}
                />
              ))}
            </div>
          ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

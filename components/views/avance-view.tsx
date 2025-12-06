import { romanNumerals } from "@/src/constants/numerosRomanos";
import { Curso } from "@/src/types/curso";
import { getCursosPorNivel } from "@/src/utils/cursosUtils";
import { calcularPorcentajeAvance } from "@/src/utils/proyeccionUtils";
import CursoCard from "../curso/curso-card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type AvanceViewProps = {
  cursos: Curso[];
};

export function AvanceView({ cursos }: AvanceViewProps) {
  const cursosPorNivel = getCursosPorNivel(cursos);

  return (
    <ScrollArea className={`w-full whitespace-nowrap`}>
      <div className="flex flex-col items-center">
        <div className="flex flex-col w-fit gap-4">
          {/* Leyenda de colores */}
          <div className="flex justify-between">
            <div className="flex flex-col min-w-max">
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
                <div className="flex items-center gap-1">
                  <div className="size-3 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                  <p className="text-xs text-muted-foreground">Pendiente</p>
                </div>
              </div>
            </div>
            {/* Porcentaje de avance */}
            <span className="text-[13px] font-medium border border-zinc-300 dark:border-zinc-700 px-2 rounded-md shadow-xs">
              {calcularPorcentajeAvance(cursos)}% avance
            </span>
          </div>
          <div className="flex justify-center gap-4">
            {Object.keys(cursosPorNivel)
              .sort((a, b) => Number(a) - Number(b))
              .map((nivel) => (
                <div key={nivel} className="flex flex-col gap-4 pb-2">
                  <div
                    className={`rounded flex justify-center items-center p-1 bg-muted shadow-sm border`}
                  >
                    <h2 className="text-center font-semibold">
                      {romanNumerals[Number(nivel)]}
                    </h2>
                  </div>
                  {cursosPorNivel[Number(nivel)].map((course) => {
                    return <CursoCard key={course.codigo} curso={course} />;
                  })}
                </div>
              ))}
          </div>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

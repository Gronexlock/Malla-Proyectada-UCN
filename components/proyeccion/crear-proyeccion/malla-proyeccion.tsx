import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Curso } from "@/src/types/curso";
import { getCursosPorNivel } from "@/src/utils/cursosUtils";
import {
  calcularPorcentajeAvance,
  getCursosBloqueantes,
  getNivelEstudiante,
  isDisperso,
} from "@/src/utils/proyeccionUtils";
import { BookOpen } from "lucide-react";
import MallaProyeccionCard from "./malla-proyeccion-card";

type MallaCurricularProps = {
  cursos: Curso[];
  onCursoClick: (curso: Curso) => void;
  ignorarRestricciones: boolean;
};

export function MallaCurricular({
  cursos,
  onCursoClick,
  ignorarRestricciones,
}: MallaCurricularProps) {
  const cursosPorNivel = getCursosPorNivel(cursos);

  return (
    <section className="flex flex-col border-t border-zinc-300 dark:border-zinc-700 w-1/2 min-h-0">
      {/* Header */}
      <header className="flex flex-col p-3 border-b border-zinc-300 dark:border-zinc-700 gap-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-green-600" size={18} />
            <h2 className="font-semibold text-sm">Malla Curricular</h2>
          </div>
          {/* Porcentaje de avance */}
          <span className="shadow-xs text-[13px] font-medium border border-zinc-300 dark:border-zinc-700 px-2 rounded-md">
            {calcularPorcentajeAvance(cursos)}% avance
          </span>
        </div>
        {/* Leyenda de colores */}
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
            <div className="size-3 bg-blue-500/70 dark:bg-blue-500/50 rounded-full"></div>
            <p className="text-xs text-muted-foreground">Pendiente</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-3 bg-orange-500/70 dark:bg-orange-500/50 rounded-full"></div>
            <p className="text-xs text-muted-foreground">Bloqueado</p>
          </div>
        </div>
      </header>
      {/* Malla */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex p-3 gap-3 min-w-max">
          {Object.entries(cursosPorNivel).map(([nivel, cursosNivel]) => (
            <div className="flex flex-col gap-2" key={nivel}>
              <div className="flex items-center gap-2 border-b border-zinc-300 dark:border-zinc-700 pb-2">
                <div className="flex bg-zinc-200 dark:bg-secondary size-5 items-center justify-center rounded-full">
                  <span className="text-[10px] font-semibold">{nivel}</span>
                </div>
                <h3 className="text-muted-foreground text-sm">Nivel {nivel}</h3>
              </div>
              {cursosNivel.map((curso) => {
                const disperso = isDisperso(curso, getNivelEstudiante(cursos));
                const cursosBloqueantes = getCursosBloqueantes(curso, cursos);

                return (
                  <MallaProyeccionCard
                    key={curso.codigo}
                    curso={curso}
                    onCursoClick={onCursoClick}
                    disperso={disperso}
                    cursosBloqueantes={cursosBloqueantes}
                    ignorarRestricciones={ignorarRestricciones}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

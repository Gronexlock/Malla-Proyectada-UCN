import { Proyeccion } from "@/src/types/proyeccion";
import { getCreditosProyeccion } from "@/src/utils/proyeccionUtils";
import CursoCard from "../curso/curso-card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type ProyeccionViewProps = {
  proyeccion: Proyeccion;
};

export function ProyeccionView({ proyeccion }: ProyeccionViewProps) {
  const creditosTotales = proyeccion.semestres.reduce(
    (total, semestre) =>
      total +
      semestre.cursos.reduce((semTotal, curso) => semTotal + curso.creditos, 0),
    0
  );

  return (
    <div className="w-full whitespace-nowrap h-full flex flex-col items-center">
      <div className="flex flex-col items-center max-h-full max-w-full">
        <div className="flex flex-col pb-4 w-full mb-2">
          <div className="flex gap-2">
            <span className="shadow-xs text-[13px] font-medium border border-zinc-300 dark:border-zinc-700 px-2 rounded-md">
              {creditosTotales} SCT / {proyeccion.semestres.length} sem.
            </span>
          </div>
        </div>
        <div className="pb-6 pr-6 min-h-0 min-w-0 max-w-full flex-1">
          <ScrollArea className="w-full h-full pr-2">
            <div className="min-w-max flex flex-col">
              <div className="flex gap-4 sticky top-0 z-10 bg-background pb-4">
                {proyeccion.semestres.map((semestre) => (
                  <div className="flex justify-between items-center gap-2 border-b border-zinc-300 dark:border-zinc-700 pb-2 w-full">
                    <div className="h-5 px-2 rounded-full bg-emerald-500/30 dark:bg-green-500/20 flex items-center justify-center">
                      <span className="text-[11px] font-semibold text-green-600 dark:text-green-400">
                        {semestre.semestre}
                      </span>
                    </div>
                    <div className="flex bg-secondary h-5 px-2 items-center justify-center rounded-full">
                      <span className="text-[10px] font-semibold">
                        {getCreditosProyeccion(semestre.cursos)} SCT
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 min-h-0">
                {proyeccion.semestres.map((semestre) => (
                  <div
                    className="flex flex-col gap-4 pb-2"
                    key={semestre.semestre}
                  >
                    {semestre.cursos.map((curso) => (
                      <CursoCard key={curso.nrc} curso={curso} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

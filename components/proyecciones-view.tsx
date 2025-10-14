import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Proyeccion } from "@/src/types/proyeccion";
import { CursoMallaCard } from "./curso-malla-card";

type ProyeccionViewProps = {
  proyeccion: Proyeccion;
};

export function ProyeccionView({ proyeccion }: ProyeccionViewProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap h-[calc(100vh-64px)]">
      <div className="flex justify-center min-w-max gap-4 pb-6 pr-6">
        {proyeccion.proyecciones.map((semestre) => (
          <div key={semestre.semestre} className="flex flex-col gap-2">
            <div className="bg-zinc-800 rounded-sm flex justify-center items-center mb-2">
              <h2 className="text-center text-white font-semibold">
                {semestre.semestre}
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              {semestre.cursos.map((curso) => (
                <CursoMallaCard
                  key={curso.codigo}
                  codigo={curso.codigo}
                  asignatura={curso.asignatura}
                  creditos={curso.creditos}
                  prereq=""
                  nivel={0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

"use client";

import { useUserStore } from "@/src/store/useUserStore";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { CursoCronoCard } from "./curso-crono-card";

export function ProyeccionesView() {
  const { proyecciones, selectedCarrera } = useUserStore();

  if (!selectedCarrera?.codigo) {
    return (
      <div className="p-4 text-center text-gray-400">
        No se ha seleccionado ninguna carrera.
      </div>
    );
  }

  if (!proyecciones || proyecciones.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No hay proyecciones registradas.
      </div>
    );
  }

  const proyeccionesPlanas = proyecciones.flatMap((p) => p.proyecciones);

  return (
    <ScrollArea className="w-full whitespace-nowrap h-[calc(100vh-64px)]">
      <div className="flex justify-center min-w-max gap-4 pb-6 pr-6">
        {proyeccionesPlanas.map((semestre) => (
          <div key={semestre.semestre} className="flex flex-col gap-2">
            <div className="bg-blue-800 rounded-sm flex justify-center items-center mb-2">
              <h2 className="text-center text-white font-semibold">
                {semestre.semestre}
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              {semestre.cursos.map((curso) => (
                <CursoCronoCard
                  key={curso.codigo}
                  nrc={""}
                  codigo={curso.codigo}
                  asignatura={curso.asignatura}
                  status={"PENDIENTE"}
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

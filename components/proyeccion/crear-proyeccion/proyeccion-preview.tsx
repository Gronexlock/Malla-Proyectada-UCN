"use client";

import { Curso } from "@/src/types/curso";
import {
  getCantidadSemestresProyeccion,
  getCreditosProyeccion,
  getCreditosProyeccionTotal,
  getUltimoSemestreProyeccion,
} from "@/src/utils/proyeccionUtils";
import { CalendarDays, Target } from "lucide-react";

type ProyeccionPreviewProps = {
  proyeccionesPreview: Record<string, Curso[]>;
};

export function ProyeccionPreview({
  proyeccionesPreview,
}: ProyeccionPreviewProps) {
  return (
    <section className="flex flex-col border-t border-l border-zinc-700 w-1/2 min-h-0">
      {/* Header Proyección */}
      <header className="flex flex-col p-3 border-b border-zinc-700 gap-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-green-600" size={18} />
            <h2 className="font-semibold text-sm">Proyección</h2>
          </div>
          {/* Créditos/semestres*/}
          <span className="text-[13px] font-medium border border-zinc-700 px-2 rounded-md">
            {getCreditosProyeccionTotal(proyeccionesPreview)} SCT /{" "}
            {getCantidadSemestresProyeccion(proyeccionesPreview)} sem.
          </span>
        </div>
        {/* Egreso estimado */}
        <div className="flex gap-2 ">
          <div className="flex items-center gap-1">
            <CalendarDays className="text-muted-foreground" size={14} />
            <p className="text-xs text-muted-foreground">
              {getUltimoSemestreProyeccion(proyeccionesPreview)
                ? `Egreso estimado: ${getUltimoSemestreProyeccion(
                    proyeccionesPreview
                  )}`
                : "Haz clic en cursos pendientes para proyectar"}
            </p>
          </div>
        </div>
      </header>
      <main className="flex p-3 gap-3 overflow-auto flex-1">
        {Object.keys(proyeccionesPreview).length > 0 ? (
          Object.entries(proyeccionesPreview).map(([nivel, cursosNivel]) => (
            <div className="flex flex-col gap-2" key={nivel}>
              <div className="flex justify-between items-center gap-2 border-b border-zinc-700 pb-2">
                <div className="h-5 px-2 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-[11px] font-semibold text-green-400">
                    {nivel}
                  </span>
                </div>
                <div className="flex bg-secondary h-5 px-2 items-center justify-center rounded-full">
                  <span className="text-[10px] font-semibold">
                    {getCreditosProyeccion(cursosNivel)} SCT
                  </span>
                </div>
              </div>
              {cursosNivel.map((curso) => {
                return (
                  <div
                    key={curso.codigo}
                    className={`flex flex-col bg-zinc-900 border border-zinc-700 p-2 rounded-lg`}
                  >
                    <div className="flex justify-between">
                      <p className="opacity-70 font-mono text-[11px]">
                        {curso.codigo}
                      </p>
                    </div>
                    <p className="text-sm text-foreground truncate">
                      {curso.asignatura}
                    </p>
                    <span className="text-[11px] opacity-70 mt-1">
                      {curso.creditos} SCT
                    </span>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center flex-col w-full">
            <Target className="text-zinc-700 mb-1" size={42} />
            <p className="text-muted-foreground">Sin proyección aún</p>
            <p className="text-muted-foreground text-sm">
              Selecciona cursos pendientes de la malla
            </p>
          </div>
        )}
      </main>
    </section>
  );
}

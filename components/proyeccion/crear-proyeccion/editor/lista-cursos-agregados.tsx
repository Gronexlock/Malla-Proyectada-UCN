"use client";

import { cn } from "@/lib/utils";
import { LIMITE_CREDITOS } from "@/src/constants/proyeccionConstants";
import { Curso } from "@/src/types/curso";
import { getCreditosProyeccion } from "@/src/utils/proyeccionUtils";
import { Trash2 } from "lucide-react";

type ListaCursosAgregadosProps = {
  cursos: Curso[];
  semestreActual: string;
  onRemoverCurso: (curso: Curso) => void;
};

export function ListaCursosAgregados({
  cursos,
  semestreActual,
  onRemoverCurso,
}: ListaCursosAgregadosProps) {
  return (
    <div className="bg-zinc-100 shadow-md dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg flex flex-col gap-2 py-8 min-h-0">
      <div className="flex justify-between px-3 items-center">
        <header className="">Cursos en {semestreActual}</header>
        <div
          className={cn(
            `flex border h-5 py-2 px-3 items-center justify-center rounded-md`,
            getCreditosProyeccion(cursos) > LIMITE_CREDITOS
              ? "dark:border-red-500 dark:text-red-400 border-red-600 text-red-500"
              : "border-zinc-300 dark:border-zinc-700"
          )}
        >
          <span className="text-xs font-semibold shadow-sm">
            {getCreditosProyeccion(cursos)} créditos
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pt-2 gap-2 flex flex-col px-3 min-h-0">
        {cursos.length > 0 ? (
          cursos.map((curso) => (
            <div
              key={curso.codigo}
              className="flex border bg-green-500/20 border-green-500/50 dark:border-green-500/30 dark:bg-green-500/10 items-center rounded-lg p-2 justify-between"
            >
              <div className="flex flex-col flex-1">
                <span className="font-mono text-xs text-muted-foreground">
                  {curso.codigo}
                </span>
                <span className="">{curso.asignatura}</span>
              </div>
              <div className="flex mr-1 gap-2 items-center">
                <div className="flex border border-zinc-400/50 dark:border-zinc-700 h-5 px-2 items-center justify-center rounded-full">
                  <span className="text-[10px] font-semibold">
                    {curso.creditos} SCT
                  </span>
                </div>
                <div
                  className="rounded p-1 hover:bg-zinc-400/50 dark:hover:bg-zinc-700/50 transition-all hover:cursor-pointer"
                  onClick={() => onRemoverCurso(curso)}
                >
                  <Trash2
                    size={18}
                    className="text-red-500 dark:text-red-600"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center h-4/5">
            <p className="text-muted-foreground">Sin cursos agregados</p>
            <p className="text-muted-foreground text-sm">
              Selecciona cursos pendientes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

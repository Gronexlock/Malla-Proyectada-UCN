"use client";

import { cn } from "@/lib/utils";
import {
  getSemestreActual,
  getSemestreSiguiente,
} from "@/src/utils/semestreUtils";

export function ListaCursosAgregadosSkeleton() {
  const semestreActual = getSemestreSiguiente(getSemestreActual());
  return (
    <div className="bg-zinc-100 shadow-md dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg flex flex-col gap-2 py-8 min-h-0">
      <div className="flex justify-between px-3 items-center">
        <header className="">Cursos en {semestreActual}</header>
        <div
          className={cn(
            `flex border h-5 py-2 px-3 items-center justify-center rounded-md border-zinc-300 dark:border-zinc-700`
          )}
        >
          <span className="text-xs font-semibold shadow-sm">0 créditos</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pt-2 gap-2 flex flex-col px-3 min-h-0">
        {
          <div className="flex flex-col justify-center items-center h-4/5">
            <p className="text-muted-foreground">Sin cursos agregados</p>
            <p className="text-muted-foreground text-sm">
              Selecciona cursos pendientes
            </p>
          </div>
        }
      </div>
    </div>
  );
}

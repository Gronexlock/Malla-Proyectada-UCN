import { CalendarDays, Target } from "lucide-react";

export function ProyeccionPreviewSkeleton() {
  return (
    <section className="flex flex-col border-t border-l border-zinc-300 dark:border-zinc-700 w-1/2 min-h-0">
      {/* Header Proyección */}
      <header className="flex flex-col p-3 border-b border-zinc-300 dark:border-zinc-700 gap-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-green-600" size={18} />
            <h2 className="font-semibold text-sm">Proyección</h2>
          </div>
          {/* Créditos/semestres*/}
          <span className="shadow-xs text-[13px] font-medium border border-zinc-300 dark:border-zinc-700 px-2 rounded-md">
            0 SCT / 0 sem.
          </span>
        </div>
        {/* Egreso estimado */}
        <div className="flex gap-2 ">
          <div className="flex items-center gap-1">
            <CalendarDays className="text-muted-foreground" size={14} />
            <p className="text-xs text-muted-foreground">
              {"Avanza un semestre para proyectar"}
            </p>
          </div>
        </div>
      </header>
      {
        <div className="flex justify-center items-center flex-col w-full h-full">
          <Target className="text-zinc-700 mb-1" size={42} />
          <p className="text-muted-foreground">Sin proyección aún</p>
          <p className="text-muted-foreground text-sm">
            Avanza un semestre para ver tu proyección
          </p>
        </div>
      }
    </section>
  );
}

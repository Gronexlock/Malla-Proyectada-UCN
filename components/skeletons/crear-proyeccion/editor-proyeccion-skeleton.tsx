import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Plus } from "lucide-react";
import { AccionesProyeccionSkeleton } from "./acciones-proyeccion-skeleton";
import { ListaCursosDisponiblesSkeleton } from "./listar-cursos-disponibles-skeleton";
import { ListaCursosAgregadosSkeleton } from "./listar-cursos-agregados-skeleton";

export function EditorProyeccionSkeleton() {
  return (
    <section className="p-3 border-t border-zinc-300 dark:border-zinc-700 flex flex-col flex-1 min-h-0">
      {/* Header de Editor */}
      <header className="flex mb-4 justify-between items-center">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Plus className="text-green-600" size={18} />
              <h2 className="font-semibold text">Editor de Proyección</h2>
            </div>
          </div>
          <div className="flex gap-2 ">
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">
                Agrega cursos al semestre actual de tu proyección
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={"2026-1"} disabled={true}>
            <SelectTrigger className="w-[150px] dark:!bg-zinc-950 dark:!border-zinc-800 hover:!bg-zinc-100 dark:hover:!bg-primary-foreground transition-all shadow-sm">
              <SelectValue placeholder="Selecciona un semestre" />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
          <Button
            className="bg-card-secondary text-foreground border hover:bg-primary-foreground hover:cursor-pointer shadow-sm"
            disabled={true}
          >
            <ArrowRight />
            Siguiente Semestre
          </Button>
        </div>
      </header>
      {/* Cartas de Editor */}
      <main className="grid grid-cols-3 flex-1 gap-3 min-h-0">
        <ListaCursosDisponiblesSkeleton />
        <ListaCursosAgregadosSkeleton />
        <AccionesProyeccionSkeleton />
      </main>
    </section>
  );
}

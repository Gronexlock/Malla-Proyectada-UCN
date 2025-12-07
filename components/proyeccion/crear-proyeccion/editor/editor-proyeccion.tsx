"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LIMITE_CREDITOS } from "@/src/constants/proyeccionConstants";
import { Curso } from "@/src/types/curso";
import {
  getCreditosProyeccion,
  getCursosDisponibles,
} from "@/src/utils/proyeccionUtils";
import { ArrowRight, Plus } from "lucide-react";
import { AccionesProyeccion } from "./acciones-proyeccion";
import { ListaCursosAgregados } from "./lista-cursos-agregados";
import { ListaCursosDisponibles } from "./lista-cursos-disponibles";

type EditorProyeccionProps = {
  cursos: Curso[];
  semestres: string[];
  semestreActual: string;
  proyeccionActual: Curso[];
  ignorarRestricciones: boolean;
  toggleCursoProyeccion: (curso: Curso) => void;
  irSiguienteSemestre: () => void;
  cambiarSemestre: (semestre: string) => void;
  proyeccionesPreview: Record<string, Curso[]>;
  setIgnorarRestricciones: (value: boolean) => void;
  guardar: () => Promise<void>;
  limpiarTodo: () => void;
  generarProyeccionAutomatica: () => void;
};

export function EditorProyeccion({
  cursos,
  semestres,
  semestreActual,
  proyeccionActual,
  ignorarRestricciones,
  toggleCursoProyeccion,
  irSiguienteSemestre,
  cambiarSemestre,
  proyeccionesPreview,
  setIgnorarRestricciones,
  guardar,
  limpiarTodo,
  generarProyeccionAutomatica,
}: EditorProyeccionProps) {
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
          <Select value={semestreActual} onValueChange={cambiarSemestre}>
            <SelectTrigger className="w-[150px] dark:!bg-zinc-950 dark:!border-zinc-800 hover:!bg-zinc-100 dark:hover:!bg-primary-foreground transition-all shadow-sm">
              <SelectValue placeholder="Selecciona un semestre" />
            </SelectTrigger>
            <SelectContent>
              {semestres.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="bg-card-secondary text-foreground border hover:bg-primary-foreground hover:cursor-pointer shadow-sm"
            onClick={irSiguienteSemestre}
            disabled={
              proyeccionActual.length === 0 ||
              (!ignorarRestricciones &&
                getCreditosProyeccion(proyeccionActual) > LIMITE_CREDITOS)
            }
          >
            <ArrowRight />
            Siguiente Semestre
          </Button>
        </div>
      </header>
      {/* Cartas de Editor */}
      <main className="grid grid-cols-3 flex-1 gap-3 min-h-0">
        <ListaCursosDisponibles
          cursos={getCursosDisponibles(cursos)}
          onAgregarCurso={toggleCursoProyeccion}
        />
        <ListaCursosAgregados
          cursos={proyeccionActual}
          semestreActual={semestreActual}
          onRemoverCurso={toggleCursoProyeccion}
        />
        <AccionesProyeccion
          cursos={cursos}
          semestreActual={semestreActual}
          proyeccionesPreview={proyeccionesPreview}
          ignorarRestricciones={ignorarRestricciones}
          setIgnorarRestricciones={setIgnorarRestricciones}
          guardar={guardar}
          limpiarTodo={limpiarTodo}
          generarProyeccionAutomatica={generarProyeccionAutomatica}
        />
      </main>
    </section>
  );
}

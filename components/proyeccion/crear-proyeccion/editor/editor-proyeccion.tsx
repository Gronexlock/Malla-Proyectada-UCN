"use client";

import { Button } from "@/components/ui/button";
import { Curso } from "@/src/types/curso";
import { ArrowRight, Plus } from "lucide-react";
import { AccionesProyeccion } from "./acciones-proyeccion";
import { ListaCursosAgregados } from "./lista-cursos-agregados";
import { ListaCursosDisponibles } from "./lista-cursos-disponibles";

type EditorProyeccionProps = {
  cursos: Curso[];
  cursosDisponibles: Curso[];
  proyeccionActual: Curso[];
  proyeccionesPreview: Record<string, Curso[]>;
  semestreActual: string;
  onAgregarCurso: (curso: Curso) => void;
  onRemoverCurso: (curso: Curso) => void;
  onSiguienteSemestre: () => void;
  onGuardar: () => void;
  onLimpiar: () => void;
};

export function EditorProyeccion({
  cursos,
  cursosDisponibles,
  proyeccionActual,
  proyeccionesPreview,
  semestreActual,
  onAgregarCurso,
  onRemoverCurso,
  onSiguienteSemestre,
  onGuardar,
  onLimpiar,
}: EditorProyeccionProps) {
  return (
    <section className="p-3 border-t border-zinc-700 flex flex-col flex-1 min-h-0">
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
          <Button
            className="bg-card-secondary text-white border hover:bg-primary-foreground hover:cursor-pointer"
            onClick={onSiguienteSemestre}
          >
            <ArrowRight />
            Siguiente Semestre
          </Button>
        </div>
      </header>
      {/* Cartas de Editor */}
      <main className="grid grid-cols-3 flex-1 gap-3 min-h-0">
        <ListaCursosDisponibles
          cursos={cursosDisponibles}
          onAgregarCurso={onAgregarCurso}
        />
        <ListaCursosAgregados
          cursos={proyeccionActual}
          semestreActual={semestreActual}
          onRemoverCurso={onRemoverCurso}
        />
        <AccionesProyeccion
          cursos={cursos}
          proyeccionesPreview={proyeccionesPreview}
          semestreActual={semestreActual}
          onGuardar={onGuardar}
          onLimpiar={onLimpiar}
        />
      </main>
    </section>
  );
}

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
import { useProyeccion } from "@/src/contexts/ProyeccionContext";
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
  proyeccionActual: Curso[];
  proyeccionesPreview: Record<string, Curso[]>;
  semestreActual: string;
  onAgregarCurso: (curso: Curso) => void;
  onRemoverCurso: (curso: Curso) => void;
  onSiguienteSemestre: () => void;
  onCambiarSemestre: (semestre: string) => void;
  onGuardar: () => void;
  onLimpiar: () => void;
};

export function EditorProyeccion({
  cursos,
  semestres,
  proyeccionActual,
  proyeccionesPreview,
  semestreActual,
  onAgregarCurso,
  onRemoverCurso,
  onSiguienteSemestre,
  onCambiarSemestre,
  onGuardar,
  onLimpiar,
}: EditorProyeccionProps) {
  const { ignorarRestricciones } = useProyeccion();
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
          <Select value={semestreActual} onValueChange={onCambiarSemestre}>
            <SelectTrigger className="w-[150px] !bg-zinc-950 !border-zinc-800 hover:!bg-primary-foreground">
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
            className="bg-card-secondary text-white border hover:bg-primary-foreground hover:cursor-pointer"
            onClick={onSiguienteSemestre}
            disabled={
              (!ignorarRestricciones &&
                getCreditosProyeccion(proyeccionActual) > LIMITE_CREDITOS) ||
              proyeccionActual.length === 0
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

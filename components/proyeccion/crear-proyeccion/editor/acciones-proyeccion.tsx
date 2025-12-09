"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Curso } from "@/src/types/curso";
import {
  getCantidadCreditosRestantes,
  getCantidadCursosPendientes,
  getCantidadSemestresProyeccion,
  getUltimoSemestreProyeccion,
  isProyeccionCompleta,
} from "@/src/utils/proyeccionUtils";
import { ArrowDownToLine, ShieldAlert, Sparkles, Trash2 } from "lucide-react";

type AccionesProyeccionProps = {
  cursos: Curso[];
  semestreActual: string;
  proyeccionesPreview: Record<string, Curso[]>;
  ignorarRestricciones: boolean;
  setIgnorarRestricciones: (value: boolean) => void;
  guardar: () => Promise<void>;
  limpiarTodo: () => void;
  generarProyeccionAutomatica: () => void;
};

export function AccionesProyeccion({
  cursos,
  semestreActual,
  proyeccionesPreview,
  ignorarRestricciones,
  setIgnorarRestricciones,
  guardar,
  limpiarTodo,
  generarProyeccionAutomatica,
}: AccionesProyeccionProps) {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 border shadow-md dark:border-zinc-700 rounded-lg flex flex-col gap-2 py-4 min-h-0">
      <header className="px-3 flex w-full justify-between gap-2 items-center">
        <div className="flex-1">Acciones</div>
        {/* Switch para ignorar restricciones */}
        <div className="shadow-sm flex items-center gap-2 justify-between dark:bg-zinc-800 p-2 border rounded-lg">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 dark:text-amber-500 text-amber-600" />
            <Label htmlFor="ignorar-restricciones" className="text-sm">
              Ignorar restricciones
            </Label>
          </div>
          <Switch
            id="ignorar-restricciones"
            checked={ignorarRestricciones}
            onCheckedChange={setIgnorarRestricciones}
          />
        </div>
      </header>
      <div className="px-3 pt-2 h-full flex flex-col justify-center">
        {/* Resumen de la proyección */}
        <div className="flex flex-col bg-zinc-100 dark:bg-zinc-800 p-3 border rounded-lg mb-3 shadow-sm">
          <span className="text-sm text-muted-foreground mb-1">
            Resumen de la proyección
          </span>
          <div className="grid grid-rows-2 grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Total semestres</p>
              <p className="font-semibold">
                {getCantidadSemestresProyeccion(proyeccionesPreview)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Créditos restantes
              </p>
              <p className="font-semibold">
                {getCantidadCreditosRestantes(cursos)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Egreso estimado</p>
              <p className="font-semibold">
                {getUltimoSemestreProyeccion(proyeccionesPreview) ??
                  semestreActual}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cursos pendientes</p>
              <p className="font-semibold">
                {getCantidadCursosPendientes(cursos)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
          {/* Botón para generar proyección automática */}
          <div className="flex gap-2 w-full ">
            <Button
              className="shadow-sm bg-purple-500 hover:bg-purple-600 font-semibold hover:cursor-pointer flex-1"
              onClick={generarProyeccionAutomatica}
            >
              <Sparkles className="h-4 w-4" />
              Proyección Óptima
            </Button>
            <Button
              className="shadow-sm bg-green-500 hover:bg-green-600 font-semibold mb-3 hover:cursor-pointer flex-1 "
              onClick={guardar}
              disabled={!isProyeccionCompleta(cursos)}
            >
              <ArrowDownToLine />
              Guardar Proyección
            </Button>
            <Button
              className="text-primary font-semibold border hover:cursor-pointer flex-1 shadow-sm"
              onClick={limpiarTodo}
              variant="outline"
            >
              <Trash2 className="h-4 w-4" />
              Limpiar Todo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

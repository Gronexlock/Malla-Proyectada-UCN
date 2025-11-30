"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProyeccion } from "@/src/contexts/ProyeccionContext";
import {
  getCantidadCreditosRestantes,
  getCantidadCursosPendientes,
  getCantidadSemestresProyeccion,
  getUltimoSemestreProyeccion,
  isProyeccionCompleta,
} from "@/src/utils/proyeccionUtils";
import { ArrowDownToLine, ShieldAlert, Sparkles, Trash2 } from "lucide-react";

export function AccionesProyeccion() {
  const {
    cursos,
    semestreActual,
    proyeccionesPreview,
    ignorarRestricciones,
    setIgnorarRestricciones,
    guardar,
    limpiarTodo,
    generarProyeccionAutomatica,
  } = useProyeccion();

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg flex flex-col gap-2 py-8 min-h-0">
      <header className="px-3">Acciones</header>
      <div className="px-3 pt-2  overflow-y-auto">
        {/* Switch para ignorar restricciones */}
        <div className="flex items-center justify-between bg-zinc-800 p-3 border rounded-lg mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
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

        {/* Resumen de la proyección */}
        <div className="flex flex-col bg-zinc-800 p-3 border rounded-lg mb-3">
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

        {/* Botón para generar proyección automática */}
        <Button
          className="bg-purple-500 hover:bg-purple-600 font-semibold w-full mb-3 hover:cursor-pointer"
          onClick={generarProyeccionAutomatica}
        >
          <Sparkles className="h-4 w-4" />
          Generar Proyección Óptima
        </Button>

        <Button
          className="bg-green-500 hover:bg-green-600 font-semibold w-full mb-3 hover:cursor-pointer"
          onClick={guardar}
          disabled={!isProyeccionCompleta(cursos)}
        >
          <ArrowDownToLine />
          Guardar Proyección
        </Button>

        <Button
          className="bg-primary-foreground text-primary hover:bg-secondary font-semibold border w-full hover:cursor-pointer"
          onClick={limpiarTodo}
        >
          <Trash2 className="h-4 w-4" />
          Limpiar Todo
        </Button>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProyeccion } from "@/src/contexts/ProyeccionContext";
import { Curso } from "@/src/types/curso";
import {
  getCantidadCreditosRestantes,
  getCantidadCursosPendientes,
  getCantidadSemestresProyeccion,
  getUltimoSemestreProyeccion,
  isProyeccionCompleta,
} from "@/src/utils/proyeccionUtils";
import { ArrowDownToLine } from "lucide-react";

type AccionesProyeccionProps = {
  cursos: Curso[];
  proyeccionesPreview: Record<string, Curso[]>;
  semestreActual: string;
  onGuardar: () => void;
  onLimpiar: () => void;
};

export function AccionesProyeccion({
  cursos,
  proyeccionesPreview,
  semestreActual,
  onGuardar,
  onLimpiar,
}: AccionesProyeccionProps) {
  const { ignorarRestricciones, setIgnorarRestricciones } = useProyeccion();

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg flex flex-col gap-2 py-8 min-h-0">
      <div className="flex justify-between px-3">
        <header>Acciones</header>
        <div className="flex items-center space-x-2">
          <Switch
            checked={ignorarRestricciones}
            onCheckedChange={setIgnorarRestricciones}
            id="ignorar-reestricciones"
          />
          <Label htmlFor="ignorar-reestricciones">Ignorar restricciones</Label>
        </div>
      </div>
      <div className="px-3 pt-2">
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
        <Button
          className="bg-green-500 hover:bg-green-600 font-semibold w-full mb-3 hover:cursor-pointer"
          onClick={onGuardar}
          disabled={!isProyeccionCompleta(cursos)}
        >
          <ArrowDownToLine />
          Guardar Proyección
        </Button>
        <Button
          className="bg-primary-foreground text-primary hover:bg-secondary font-semibold border w-full hover:cursor-pointer"
          onClick={onLimpiar}
        >
          Limpiar Todo
        </Button>
      </div>
    </div>
  );
}

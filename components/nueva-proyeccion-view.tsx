"use client";

import { cn } from "@/lib/utils";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { Curso } from "@/src/types/curso";
import { getCursosPorNivel } from "@/src/utils/cursosUtils";
import { MoveLeft, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CursoCard } from "./curso-card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Switch } from "./ui/switch";

type CrearProyeccionViewProps = {
  cursos: Curso[];
};

export function NuevaProyeccionView(cursosProp: CrearProyeccionViewProps) {
  const [cursos, setCursos] = useState<Curso[]>(cursosProp.cursos);
  const cursosPorNivel = getCursosPorNivel(cursos);

  useEffect(() => {
    setCursos(cursosProp.cursos);
  }, [cursosProp.cursos]);

  const [ignorarRestricciones, setIgnorarRestricciones] = useState(false);
  const [proyeccionActual, setProyeccionActual] = useState<Curso[]>([]);

  function addCursoToProyeccion(curso: Curso) {
    setProyeccionActual([...proyeccionActual, curso]);
  }

  function removeCursoFromProyeccion(curso: Curso) {
    setProyeccionActual(
      proyeccionActual.filter((c) => c.codigo !== curso.codigo)
    );
  }

  function toggleCursoProyeccion(curso: Curso) {
    const isInProyeccion = proyeccionActual.some(
      (c) => c.codigo === curso.codigo
    );
    if (isInProyeccion) {
      removeCursoFromProyeccion(curso);
    } else {
      addCursoToProyeccion(curso);
    }
  }

  return (
    <div className="flex justify-center w-full">
      <ScrollArea className="min-w-0">
        <div className="inline-flex gap-4 p-6 pb-9 border border-r-0 rounded-l-lg bg-zinc-100">
          {Object.keys(cursosPorNivel)
            .sort((a, b) => Number(a) - Number(b))
            .map((level) => (
              <div key={level} className="flex flex-col gap-2">
                <div className="bg-zinc-400 rounded-sm flex justify-center items-center mb-2">
                  <h2 className="text-center font-semibold">
                    {romanNumerals[level]}
                  </h2>
                </div>
                {cursosPorNivel[level].map((course) => {
                  return (
                    <div
                      key={course.codigo}
                      className="rounded-md border border-transparent transition-opacity"
                    >
                      <CursoCard
                        curso={{
                          ...course,
                          status: proyeccionActual.includes(course)
                            ? "PROYECTADO"
                            : course.status,
                        }}
                        onClick={() => toggleCursoProyeccion(course)}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
        <ScrollBar orientation="horizontal" className="" />
      </ScrollArea>
      <div className="w-64 bg-white shrink-0 flex flex-col border border-l-0 rounded-r-lg items-center text-wrap text-center">
        <div className="w-full">
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 items-center w-full border-b justify-center py-4 mb-2">
              <Switch
                id="ignorar-reestricciones"
                checked={ignorarRestricciones}
                onCheckedChange={setIgnorarRestricciones}
                className="hover:cursor-pointer"
              />
              <Label htmlFor="ignorar-reestricciones" className="text-md">
                Ignorar restricciones
              </Label>
            </div>
            {/* TODO: Quitar */}
            <h2 className="font-bold text-lg mb-1">2026-1</h2>
            <div
              className={cn(
                "px-2 py-1 rounded-full text-white text-sm font-semibold transition-colors mt-1 mb-4 max-w-fit bg-zinc-900"
                // {
                //   "bg-zinc-900": getCreditosSemestreActual() < LIMITE_CREDITOS,
                //   "bg-amber-500":
                //     getCreditosSemestreActual() === LIMITE_CREDITOS,
                //   "bg-red-600": getCreditosSemestreActual() > LIMITE_CREDITOS,
                // }
              )}
            >
              Créditos: 25
            </div>
          </div>
        </div>
        <div className="mb-4 pt-2 flex flex-col items-center flex-1 w-full h-full overflow-y-auto">
          {proyeccionActual.length === 0 && (
            <div className="text-gray-400 text-sm ">
              Selecciona cursos pendientes o reprobados para agregarlos aquí.
            </div>
          )}
          <div className="w-full">
            <ul className="space-y-4">
              {proyeccionActual.map((curso) => (
                <li
                  key={curso.codigo}
                  className="relative group flex justify-center"
                >
                  <CursoCard
                    curso={{ ...curso, status: "PENDIENTE" }}
                    onClick={() => toggleCursoProyeccion(curso)}
                    // bloqueantes={getCursosBloqueantes(curso)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-end items-center pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
              <Button
                className="cursor-pointer mt-4"
                // onClick={irSemestreAnterior}
                // disabled={semestreIndex === 0}
              >
                <MoveLeft />
                Anterior
              </Button>
              <Button
                className="cursor-pointer mt-4"
                // onClick={irSiguienteSemestre}
                // disabled={proyeccionActual.length === 0}
              >
                Siguiente
                <MoveRight />
              </Button>
            </div>
            <Button
              // onClick={guardarProyecciones}
              className="w-full cursor-pointer"
              variant="default"
              //   disabled={
              //     proyeccionActual.length === 0 ||
              //     (!ignorarRestricciones &&
              //       getCreditosSemestreActual() > LIMITE_CREDITOS)
              //   }
            >
              Guardar Proyección
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

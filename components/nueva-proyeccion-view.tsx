"use client";

import { cn } from "@/lib/utils";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { LIMITE_CREDITOS } from "@/src/constants/proyeccionConstants";
import { Curso, CursoStatus } from "@/src/types/curso";
import { getCursosPorNivel, getCursoStatus } from "@/src/utils/cursosUtils";
import {
  aprobarCursosInscritos,
  getCreditosProyeccion,
  getCursosBloqueantes,
  inscribirCursosAprobados,
  toggleCursoProyeccionActual,
  toggleEstadoCurso,
} from "@/src/utils/proyeccionUtils";
import {
  getSemestreActual,
  getSemestreSiguiente,
} from "@/src/utils/semestreUtils";
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

  const [semestres, setSemestres] = useState<string[]>([
    getSemestreSiguiente(getSemestreActual()),
  ]);
  const [semestreIndex, setSemestreIndex] = useState(0);
  const [proyeccionesPorSemestre, setProyeccionesPorSemestre] = useState<
    Record<string, Curso[]>
  >({ [semestres[0]]: [] });

  const semestreActual = semestres[semestreIndex];
  const proyeccionActual = proyeccionesPorSemestre[semestreActual] || [];

  function toggleCursoProyeccion(cursoToToggle: Curso) {
    const nuevaProyeccion = toggleCursoProyeccionActual(
      cursoToToggle,
      proyeccionActual
    );

    setCursos(toggleEstadoCurso(cursos, cursoToToggle));
    setProyeccionesPorSemestre((prev) => ({
      ...prev,
      [semestreActual]: nuevaProyeccion,
    }));
  }

  function irSiguienteSemestre() {
    const siguienteSemestre = getSemestreSiguiente(semestreActual);

    setCursos(aprobarCursosInscritos(cursos));
    setSemestreIndex(semestreIndex + 1);
    setSemestres((prev) => [...prev, siguienteSemestre]);
    setProyeccionesPorSemestre((prev) => ({
      ...prev,
      [siguienteSemestre]: [],
    }));
  }

  function irSemestreAnterior() {
    const semestreAnterior = semestres[semestreIndex - 1];
    const proyeccionAnterior = proyeccionesPorSemestre[semestreAnterior] || [];

    setCursos(
      inscribirCursosAprobados(cursos, proyeccionActual, proyeccionAnterior)
    );
    setProyeccionesPorSemestre((prev) => ({
      ...prev,
      [semestreActual]: [],
    }));
    setSemestres((prev) => prev.slice(0, -1));
    setSemestreIndex(semestreIndex - 1);
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
                {cursosPorNivel[level].map((curso) => {
                  const status = getCursoStatus(curso);
                  return (
                    <div
                      key={curso.codigo}
                      className="rounded-md border border-transparent transition-opacity"
                    >
                      <CursoCard
                        curso={{
                          ...curso,
                          status: [status],
                        }}
                        muted={status === "APROBADO"}
                        bloqueantes={getCursosBloqueantes(curso, cursos)}
                        onClick={
                          status !== "APROBADO"
                            ? () => toggleCursoProyeccion(curso)
                            : undefined
                        }
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
            <h2 className="font-bold text-lg mb-1">{semestreActual}</h2>
            <div
              className={cn(
                "px-2 py-1 rounded-full text-white text-sm font-semibold transition-colors mt-1 mb-4 max-w-fit bg-zinc-900",
                {
                  "bg-zinc-900":
                    getCreditosProyeccion(proyeccionActual) < LIMITE_CREDITOS,
                  "bg-amber-500":
                    getCreditosProyeccion(proyeccionActual) === LIMITE_CREDITOS,
                  "bg-red-600":
                    getCreditosProyeccion(proyeccionActual) > LIMITE_CREDITOS,
                }
              )}
            >
              Créditos: {getCreditosProyeccion(proyeccionActual)}
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
                    curso={{ ...curso, status: [CursoStatus.PENDIENTE] }}
                    onClick={() => toggleCursoProyeccion(curso)}
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
                onClick={irSemestreAnterior}
                disabled={semestreIndex === 0}
              >
                <MoveLeft />
                Anterior
              </Button>
              <Button
                className="cursor-pointer mt-4"
                onClick={irSiguienteSemestre}
                disabled={proyeccionActual.length === 0}
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

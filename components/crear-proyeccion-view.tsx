"use client";

import { cn } from "@/lib/utils";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { Curso } from "@/src/types/curso";
import { getCursosPorNivel } from "@/src/utils/cursosUtils";
import { actualizarAvance } from "@/src/utils/proyeccionUtils";
import { getSemestreActual, getSemestreSiguiente } from "@/src/utils/semestre";
import { Lock, MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";
import { CursoCard } from "./curso-card";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Label } from "./ui/label";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Switch } from "./ui/switch";

type CrearProyeccionViewProps = {
  avance: Curso[];
};

export function CrearProyeccionView({ avance }: CrearProyeccionViewProps) {
  const [cursos, setCursos] = useState<Curso[]>(actualizarAvance(avance));
  const [altura, setAltura] = useState(0);
  const cursosPorNivel = getCursosPorNivel(cursos);
  const [semestres, setSemestres] = useState([
    getSemestreSiguiente(getSemestreActual()),
  ]);
  const [semestreIndex, setSemestreIndex] = useState(0);
  const semestreActual = semestres[semestreIndex];
  const [proyeccionesPorSemestre, setProyeccionesPorSemestre] = useState<
    Record<string, Curso[]>
  >({});
  const proyeccionActual = proyeccionesPorSemestre[semestreActual] || [];
  const [avancePorSemestre, setAvancePorSemestre] = useState<
    Record<string, Curso[]>
  >({});
  const LIMITE_CREDITOS = 30;
  const [ignorarRestricciones, setIgnorarRestricciones] = useState(false);

  function toggleCursoProyeccion(curso: Curso) {
    setProyeccionesPorSemestre((prev) => {
      const isCursoSelected = proyeccionActual.some(
        (c) => c.codigo === curso.codigo
      );

      if (isCursoSelected) {
        setCursos((prevCursos) =>
          prevCursos.map((c) =>
            c.codigo === curso.codigo ? { ...c, status: "PENDIENTE" } : c
          )
        );
        return {
          ...prev,
          [semestreActual]: proyeccionActual.filter(
            (c) => c.codigo !== curso.codigo
          ),
        };
      } else {
        setCursos((prevCursos) =>
          prevCursos.map((c) =>
            c.codigo === curso.codigo ? { ...c, status: "INSCRITO" } : c
          )
        );
        return {
          ...prev,
          [semestreActual]: [...proyeccionActual, curso],
        };
      }
    });
  }

  function isAlreadySelected(codigo: string): boolean {
    for (let i = 0; i < semestres.length; i++) {
      const semestre = semestres[i];
      const proyeccion = proyeccionesPorSemestre[semestre] || [];
      if (proyeccion.some((c) => c.codigo === codigo)) {
        return true;
      }
    }
    return false;
  }

  function irSiguienteSemestre() {
    setAvancePorSemestre((prev) => ({
      ...prev,
      [semestreActual]: avance,
    }));

    if (semestreIndex < semestres.length - 1) {
      setSemestreIndex(semestreIndex + 1);
    } else {
      const ultimoSemestre = semestres[semestres.length - 1];
      const siguienteSemestre = getSemestreSiguiente(ultimoSemestre);
      setSemestres((prev) => [...prev, siguienteSemestre]);
      setSemestreIndex(semestreIndex + 1);
    }
    setCursos(actualizarAvance(cursos));
  }

  function irSemestreAnterior() {
    if (semestreIndex > 0) {
      setAvancePorSemestre((prev) => ({
        ...prev,
        [semestreActual]: avance,
      }));

      setProyeccionesPorSemestre((prev) => {
        const nuevo = { ...prev };
        delete nuevo[semestreActual];
        return nuevo;
      });

      const anteriorSemestre = semestres[semestreIndex - 1];
      setCursos(avancePorSemestre[anteriorSemestre] || []);
      setSemestreIndex(semestreIndex - 1);
    }
  }

  function getCreditosSemestreActual(): number {
    return proyeccionActual.reduce((total, curso) => total + curso.creditos, 0);
  }

  function cumplePrerrequisitos(curso: Curso): boolean {
    if (curso.prerrequisitos.length !== 0 || ignorarRestricciones) return true;
    return curso.prerrequisitos.every((pre) =>
      avance.some((a) => a.codigo === pre.codigo && a.status === "APROBADO")
    );
  }

  function getCursosBloqueantes(curso: Curso) {
    if (getCursoStatus(curso.codigo) === "APROBADO") return [];
    const aprobados = avance
      .filter((a) => a.status === "APROBADO")
      .map((a) => a.codigo);
    return curso.prerrequisitos.filter(
      (pre) => !aprobados.includes(pre.codigo)
    );
  }

  function getCursoStatus(codigo: string): Curso["status"] {
    const cursoAvance = avance.filter((curso) => curso.codigo === codigo);
    if (cursoAvance.length === 0) {
      return "PENDIENTE";
    }
    const statuses = cursoAvance.map((curso) => curso.status);
    if (statuses.includes("APROBADO")) {
      return "APROBADO";
    }
    if (statuses.includes("INSCRITO")) {
      return "INSCRITO";
    }
    return "REPROBADO";
  }

  const callbackRef = (node: HTMLDivElement | null) => {
    if (node) setAltura(node.offsetHeight);
  };

  return (
    <div className="flex justify-center w-full">
      <ScrollArea className="min-w-0">
        <div
          ref={callbackRef}
          className="inline-flex gap-4 p-6 pb-9 border border-r-0 rounded-l-lg bg-zinc-100"
        >
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
                  const status = course.status;
                  const alreadySelected = isAlreadySelected(course.codigo);
                  const canBeSelected =
                    status !== "APROBADO" &&
                    ((status === "INSCRITO" && alreadySelected) ||
                      (!alreadySelected && cumplePrerrequisitos(course)));
                  const bloqueantes = getCursosBloqueantes(course);
                  return (
                    <div key={course.codigo} className="relative">
                      {bloqueantes.length > 0 && !ignorarRestricciones && (
                        <HoverCard openDelay={200} closeDelay={200}>
                          <HoverCardTrigger>
                            <Lock
                              size={16}
                              strokeWidth={2.3}
                              className="text-amber-600 absolute top-20 left-18 z-20"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="flex justify-center w-40">
                            <div className="flex flex-col gap-1">
                              <h2 className="font-bold text-sm text-center">
                                BLOQUEADO POR
                              </h2>
                              <hr />
                              {bloqueantes.map((bloq) => (
                                <p key={bloq.codigo} className="text-xs">
                                  • {bloq.asignatura}
                                </p>
                              ))}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )}
                      <div
                        key={course.codigo}
                        className={cn(
                          "rounded-md border border-transparent transition-opacity",
                          (status === "APROBADO" ||
                            !cumplePrerrequisitos(course)) &&
                            "opacity-30"
                        )}
                      >
                        <CursoCard
                          curso={course}
                          bloqueantes={getCursosBloqueantes(course)}
                          onClick={
                            canBeSelected
                              ? () => toggleCursoProyeccion(course)
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
        <ScrollBar orientation="horizontal" className="" />
      </ScrollArea>
      <div
        className={`w-64 bg-white shrink-0 flex flex-col border border-l-0 rounded-r-lg items-center text-wrap text-center`}
        style={{
          maxHeight: `${altura}px`,
          height: `${altura}px`,
        }}
      >
        <div className="w-full">
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 items-center w-full border-b justify-center py-4 mb-2">
              <Switch
                id="ignorar-reestricciones"
                checked={ignorarRestricciones}
                onCheckedChange={setIgnorarRestricciones}
              />
              <Label htmlFor="ignorar-reestricciones" className="text-md">
                Ignorar restricciones
              </Label>
            </div>
            <h2 className="font-bold text-lg mb-1">{semestreActual}</h2>
            <div
              className={cn(
                "px-2 py-1 rounded-full text-white text-sm font-semibold transition-colors mt-1 mb-4 max-w-fit",
                {
                  "bg-zinc-900": getCreditosSemestreActual() < LIMITE_CREDITOS,
                  "bg-amber-500":
                    getCreditosSemestreActual() === LIMITE_CREDITOS,
                  "bg-red-600": getCreditosSemestreActual() > LIMITE_CREDITOS,
                }
              )}
            >
              Créditos: {getCreditosSemestreActual()}
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
                    curso={curso}
                    bloqueantes={getCursosBloqueantes(curso)}
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
              disabled={
                proyeccionActual.length === 0 ||
                (!ignorarRestricciones &&
                  getCreditosSemestreActual() > LIMITE_CREDITOS)
              }
            >
              Guardar Proyección
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

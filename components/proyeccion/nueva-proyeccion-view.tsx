"use client";

import { cn } from "@/lib/utils";
import { guardarProyeccion } from "@/src/actions/proyeccionActions";
import { romanNumerals } from "@/src/constants/numerosRomanos";
import { LIMITE_CREDITOS } from "@/src/constants/proyeccionConstants";
import { Curso, CursoStatus } from "@/src/types/curso";
import { getCursosPorNivel, getCursoStatus } from "@/src/utils/cursosUtils";
import { generarProyeccionOptima } from "@/src/utils/generarProyeccionOptima";
import {
  aprobarCursosInscritos,
  getCreditosProyeccion,
  getCursosBloqueantes,
  getNivelEstudiante,
  inscribirCursosAprobados,
  isDisperso,
  toggleCursoProyeccionActual,
  toggleEstadoCurso,
} from "@/src/utils/proyeccionUtils";
import {
  getSemestreActual,
  getSemestreSiguiente,
} from "@/src/utils/semestreUtils";
import { MoveLeft, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CursoCard } from "../curso/curso-card";
import { BloqueadoHover } from "../curso/hovers/bloqueantes-hover";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

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

  const [proyeccionesPreview, setProyeccionesPreview] = useState<
    Record<string, Curso[]>
  >({});

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
    setProyeccionesPreview((prev) => ({
      ...prev,
      [semestreActual]: proyeccionActual,
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

  async function handleGuardarProyeccion() {
    try {
      await guardarProyeccion(proyeccionesPorSemestre);
      toast.success("Proyección guardada exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la proyección");
    }
  }

  function handleGenerarProyeccionAutomatica() {
    const proyeccionGenerada = generarProyeccionOptima(cursos);

    const semestresGenerados = Object.keys(proyeccionGenerada).sort();
    setSemestres(semestresGenerados);
    setSemestreIndex(0);
    setProyeccionesPorSemestre(proyeccionGenerada);

    const previewSemestres: Record<string, Curso[]> = {};
    semestresGenerados.slice(0, -1).forEach((semestre) => {
      previewSemestres[semestre] = proyeccionGenerada[semestre];
    });
    setProyeccionesPreview(previewSemestres);

    let cursosActualizados = [...cursos];

    semestresGenerados.slice(0, -1).forEach((semestre) => {
      proyeccionGenerada[semestre].forEach((cursoProyectado) => {
        cursosActualizados = cursosActualizados.map((c) =>
          c.codigo === cursoProyectado.codigo
            ? { ...c, status: [CursoStatus.APROBADO] }
            : c
        );
      });
    });

    const ultimoSemestre = semestresGenerados[semestresGenerados.length - 1];
    proyeccionGenerada[ultimoSemestre].forEach((cursoProyectado) => {
      cursosActualizados = cursosActualizados.map((c) =>
        c.codigo === cursoProyectado.codigo
          ? { ...c, status: [CursoStatus.INSCRITO] }
          : c
      );
    });

    setCursos(cursosActualizados);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex justify-center w-full flex-1 border border-l-0 h-[50vh]">
        <div className="min-w-0 flex-1 overflow-auto border-r border-zinc-200">
          <div className="inline-flex gap-4 p-6 pb-9 bg-zinc-100">
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
                    const nivel = getNivelEstudiante(cursos);
                    const isCursoDisperso = isDisperso(curso, nivel);
                    const bloqueantes = getCursosBloqueantes(curso, cursos);
                    const tieneRestricciones =
                      (bloqueantes && bloqueantes.length > 0) ||
                      isCursoDisperso;

                    const isClicklable =
                      !curso.status.includes(CursoStatus.APROBADO) &&
                      (ignorarRestricciones ||
                        (!isCursoDisperso && bloqueantes?.length === 0));

                    return (
                      <div
                        key={curso.codigo}
                        className="rounded-md border border-transparent transition-opacity relative"
                      >
                        <CursoCard
                          curso={{
                            ...curso,
                            status: [status],
                          }}
                          bloqueantes={bloqueantes}
                          disperso={isCursoDisperso}
                          muted={!isClicklable}
                          onClick={
                            isClicklable
                              ? () => toggleCursoProyeccion(curso)
                              : undefined
                          }
                        />
                        {tieneRestricciones && (
                          <BloqueadoHover
                            className="absolute bottom-1 left-1"
                            cursosPendientes={bloqueantes}
                            nivelDispersion={
                              isCursoDisperso ? curso.nivel : undefined
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        </div>
        <div className="min-w-0 flex-1 overflow-auto bg-zinc-100">
          <div className="inline-flex gap-4 p-6 pb-9">
            {Object.keys(proyeccionesPreview).map((semestre) => (
              <div key={semestre} className="flex flex-col gap-2">
                <div className="bg-zinc-400 rounded-sm flex justify-center items-center mb-2">
                  <h2 className="text-center font-semibold">{semestre}</h2>
                </div>
                {proyeccionesPreview[semestre].map((curso) => {
                  return (
                    <div
                      key={curso.codigo}
                      className="rounded-md border border-transparent transition-opacity relative"
                    >
                      <CursoCard
                        curso={{
                          ...curso,
                          status: [CursoStatus.PENDIENTE],
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col border border-t-0 items-center text-wrap text-center flex-1">
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
                  className="relative group flex justify-center hover:cursor-pointer"
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
        <div className="flex flex-col justify-end items-center p-4">
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
              onClick={handleGuardarProyeccion}
              className="w-full cursor-pointer"
              variant="default"
              disabled={
                proyeccionActual.length === 0 ||
                (!ignorarRestricciones &&
                  getCreditosProyeccion(proyeccionActual) > LIMITE_CREDITOS)
              }
            >
              Guardar Proyección
            </Button>
            <Button
              onClick={handleGenerarProyeccionAutomatica}
              className="w-full cursor-pointer"
              variant="default"
            >
              Generar Proyección Automática
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

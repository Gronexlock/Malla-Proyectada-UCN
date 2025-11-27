"use client";

import { guardarProyeccion } from "@/src/actions/proyeccionActions";
import { Curso, CursoStatus } from "@/src/types/curso";
import { getCursosPorNivel, getCursoStatus } from "@/src/utils/cursosUtils";
import { generarProyeccionOptima } from "@/src/utils/generarProyeccionOptima";
import {
  aprobarCursosInscritos,
  inscribirCursosAprobados,
  toggleCursoProyeccionActual,
  toggleEstadoCurso,
} from "@/src/utils/proyeccionUtils";
import {
  getSemestreActual,
  getSemestreSiguiente,
} from "@/src/utils/semestreUtils";
import {
  BookOpen,
  CalendarDays,
  CircleCheckBig,
  Clock4,
  Plus,
  Search,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

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
    await guardarProyeccion(proyeccionesPorSemestre);
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

  const statusStyles: Record<
    CursoStatus,
    { color: string; icon: React.ComponentType<any> }
  > = {
    [CursoStatus.APROBADO]: {
      color: "emerald",
      icon: CircleCheckBig,
    },
    [CursoStatus.PENDIENTE]: {
      color: "blue",
      icon: Clock4,
    },
    [CursoStatus.REPROBADO]: {
      color: "gray",
      icon: CircleCheckBig,
    },
    [CursoStatus.INSCRITO]: {
      color: "--",
      icon: Clock4,
    },
  };

  return (
    <div
      className={`grid grid-rows-2 grid-cols-2 h-[calc(100vh-2rem)] bg-neutral-950`}
    >
      {/* Malla Curricular */}
      <section className="flex flex-col border-t border-zinc-700">
        {/* Header Malla Curricular */}
        <header className="flex flex-col p-3 border-b border-zinc-700 gap-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="text-green-600" size={18} />
              <h2 className="font-semibold text-sm">Malla Curricular</h2>
            </div>
            {/* Porcentaje de avance */}
            <span className="text-[13px] font-medium border border-zinc-700 px-2 rounded-md">
              46% avance
            </span>
          </div>
          {/* Leyenda de colores */}
          <div className="flex gap-2 ">
            <div className="flex items-center gap-1">
              <div className="size-3 bg-emerald-500/50 rounded-full"></div>
              <p className="text-xs text-muted-foreground">Aprobado</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-3 bg-red-500/50 rounded-full"></div>
              <p className="text-xs text-muted-foreground">Reprobado</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-3 bg-blue-500/50 rounded-full"></div>
              <p className="text-xs text-muted-foreground">Pendiente</p>
            </div>
          </div>
        </header>
        <main className="flex p-3 gap-3 overflow-auto">
          {Object.entries(cursosPorNivel).map(([nivel, cursosNivel]) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 border-b border-zinc-700 pb-2">
                <div className="flex bg-secondary size-5 items-center justify-center rounded-full">
                  <span className="text-[10px] font-semibold">{nivel}</span>
                </div>
                <h3 className="text-muted-foreground text-sm">Nivel {nivel}</h3>
              </div>
              {cursosNivel.map((curso) => {
                const cursoColor = statusStyles[getCursoStatus(curso)].color;
                const IconComponent = statusStyles[getCursoStatus(curso)].icon;
                return (
                  <div
                    className={`flex flex-col bg-${cursoColor}-500/20 border border-${cursoColor}-500/50 text-${cursoColor}-400 opacity-80 p-2 rounded-lg`}
                  >
                    <div className="flex justify-between">
                      <p className="opacity-70 font-mono text-[11px]">
                        {curso.codigo}
                      </p>
                      <IconComponent size={13} />
                    </div>
                    <p className="text-sm text-foreground truncate">
                      {curso.asignatura}
                    </p>
                    <span className="text-[11px] opacity-70 mt-1">
                      {curso.creditos} SCT
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </main>
      </section>

      {/* Proyección */}
      <section className="flex flex-col border-t border-l border-zinc-700">
        {/* Header Proyección */}
        <header className="flex flex-col p-3 border-b border-zinc-700 gap-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Target className="text-green-600" size={18} />
              <h2 className="font-semibold text-sm">Proyección</h2>
            </div>
            {/* Créditos/semestres*/}
            <span className="text-[13px] font-medium border border-zinc-700 px-2 rounded-md">
              7 SCT / 1 sem.
            </span>
          </div>
          {/* Egreso estimado */}
          <div className="flex gap-2 ">
            <div className="flex items-center gap-1">
              <CalendarDays className="text-muted-foreground" size={14} />
              <p className="text-xs text-muted-foreground">
                Egreso estimado: 2026-1
              </p>
            </div>
          </div>
        </header>
        <main className="flex p-3 gap-3 overflow-auto">
          {Object.entries(cursosPorNivel).map(([nivel, cursosNivel]) => (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2 border-b border-zinc-700 pb-2">
                <div className="h-5 px-2 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-[11px] font-semibold text-green-400">
                    2026-1
                  </span>
                </div>
                <div className="flex bg-secondary h-5 px-2 items-center justify-center rounded-full">
                  <span className="text-[10px] font-semibold">7 SCT</span>
                </div>
              </div>
              {cursosNivel.map((curso) => {
                return (
                  <div
                    className={`flex flex-col bg-zinc-900 border border-zinc-700 p-2 rounded-lg`}
                  >
                    <div className="flex justify-between">
                      <p className="opacity-70 font-mono text-[11px]">
                        {curso.codigo}
                      </p>
                    </div>
                    <p className="text-sm text-foreground truncate">
                      {curso.asignatura}
                    </p>
                    <span className="text-[11px] opacity-70 mt-1">
                      {curso.creditos} SCT
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </main>
      </section>

      {/* Editor de Proyección */}
      <section className="p-3 col-span-2 border-t border-zinc-700 flex flex-col">
        {/* Header de Editor */}
        <header className="flex flex-col mb-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Plus className="text-green-600" size={18} />
              <h2 className="font-semibold text">Editor de Proyección</h2>
            </div>
          </div>
          {/* Egreso estimado */}
          <div className="flex gap-2 ">
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">
                Agrega cursos al semestro actual de tu proyección
              </p>
            </div>
          </div>
        </header>
        <main className="grid grid-cols-3 flex-1 gap-3">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg flex flex-col gap-2">
            <header className="pt-8 px-3">Buscar Cursos Disponibles</header>
            <div className="px-3 pt-2">
              <InputGroup>
                <InputGroupAddon>
                  <Search size={16} />
                </InputGroupAddon>
                <InputGroupInput placeholder="Buscar curso por código o nombre..." />
              </InputGroup>
            </div>
            <div className="flex-1 overflow-y-auto pt-2 gap-2 flex flex-col max-h-96 px-3">
              {cursos.map((curso) => (
                <div className="flex border items-center rounded p-2 justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-muted-foreground">
                      {curso.codigo}
                    </span>
                    <span>{curso.asignatura}</span>
                    <div className="flex mt-1 gap-1">
                      <div className="flex border border-zinc-700 h-5 px-2 items-center justify-center rounded-full">
                        <span className="text-[10px] font-semibold">
                          {curso.creditos} SCT
                        </span>
                      </div>
                      <div className="flex bg-secondary h-5 px-2 items-center justify-center rounded-md">
                        <span className="text-[10px] font-semibold">
                          Prereq: EST101
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mr-2">
                    <Plus size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-600">a</div>
          <div className="bg-zinc-600">a</div>
        </main>
      </section>
    </div>
  );
}

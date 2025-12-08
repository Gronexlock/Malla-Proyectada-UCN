"use client";

import { guardarProyeccion } from "@/src/actions/proyeccionActions";
import { Curso } from "@/src/types/curso";
import { generarProyeccionOptima } from "@/src/utils/generarProyeccionOptima";
import {
  aplicarEstadosProyeccion,
  aprobarCursosInscritos,
  irSemestreAnterior,
  toggleCursoProyeccionActual,
  toggleEstadoCurso,
} from "@/src/utils/proyeccionUtils";
import {
  getSemestreActual,
  getSemestreSiguiente,
} from "@/src/utils/semestreUtils";
import { useState } from "react";
import { toast } from "sonner";
import { EditorProyeccion } from "./editor/editor-proyeccion";
import { MallaCurricular } from "./malla-proyeccion";
import { ProyeccionPreview } from "./proyeccion-preview";

type NuevaProyeccionViewProps = {
  cursosIniciales: Curso[];
  hasSeenTutorial: boolean;
};

export function NuevaProyeccionView({
  cursosIniciales,
  hasSeenTutorial,
}: NuevaProyeccionViewProps) {
  const [cursos, setCursos] = useState<Curso[]>(
    cursosIniciales.map((curso) => ({ ...curso, status: [...curso.status] }))
  );
  const [semestres, setSemestres] = useState<string[]>([
    getSemestreSiguiente(getSemestreActual()),
  ]);
  const [semestreIndex, setSemestreIndex] = useState(0);
  const [proyeccionesPorSemestre, setProyeccionesPorSemestre] = useState<
    Record<string, Curso[]>
  >({ [semestres[0]]: [] });
  const [proyeccionesPreview, setProyeccionesPreview] = useState<
    Record<string, Curso[]>
  >({});
  const [ignorarRestricciones, setIgnorarRestricciones] = useState(false);

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
    setProyeccionesPreview((prev) => ({
      ...prev,
      [semestreActual]: proyeccionActual,
    }));
  }

  function cambiarSemestre(semestreObjetivo: string) {
    const { nuevosCursos, nuevosSemestres, nuevasProyecciones, nuevaPreview } =
      irSemestreAnterior(
        semestreObjetivo,
        semestres,
        cursos,
        proyeccionesPorSemestre
      );

    setCursos(nuevosCursos);
    setSemestres(nuevosSemestres);
    setProyeccionesPorSemestre(nuevasProyecciones);
    setProyeccionesPreview(nuevaPreview);
    setSemestreIndex(nuevosSemestres.length - 1);
  }

  async function guardar() {
    try {
      await guardarProyeccion(proyeccionesPreview);
      toast.success("Proyección guardada exitosamente");
    } catch (error) {
      toast.error("Error al guardar la proyección");
    }
  }

  function limpiarTodo() {
    const firstSemester = getSemestreSiguiente(getSemestreActual());
    setSemestres([firstSemester]);
    setSemestreIndex(0);
    setProyeccionesPorSemestre({ [firstSemester]: [] });
    setProyeccionesPreview({});
    setCursos(
      cursosIniciales.map((curso) => ({
        ...curso,
        status: [...curso.status],
      }))
    );
  }

  function generarProyeccionAutomatica() {
    const proyeccionGenerada = generarProyeccionOptima(cursosIniciales);
    const semestresGenerados = Object.keys(proyeccionGenerada).sort();

    if (semestresGenerados.length === 0) {
      toast.info("Todos los cursos ya están aprobados o proyectados.");
      return;
    }

    const ultimoSemestre = semestresGenerados[semestresGenerados.length - 1];
    const semestreSiguiente = getSemestreSiguiente(ultimoSemestre);
    const todosLosSemestres = [...semestresGenerados, semestreSiguiente];

    setSemestres(todosLosSemestres);
    setSemestreIndex(todosLosSemestres.length - 1);

    setProyeccionesPorSemestre({
      ...proyeccionGenerada,
      [semestreSiguiente]: [],
    });

    setProyeccionesPreview({ ...proyeccionGenerada });

    const cursosActualizados = aplicarEstadosProyeccion(
      cursosIniciales,
      proyeccionGenerada
    );
    setCursos(cursosActualizados);
  }

  return (
    <div className={`h-[calc(100vh-3.5rem)] flex flex-col`}>
      <div className="flex h-3/5 min-h-0">
        <MallaCurricular
          cursos={cursos}
          onCursoClick={toggleCursoProyeccion}
          ignorarRestricciones={ignorarRestricciones}
        />
        <ProyeccionPreview proyeccionesPreview={proyeccionesPreview} />
      </div>
      <EditorProyeccion
        cursos={cursos}
        semestres={semestres}
        semestreActual={semestreActual}
        proyeccionActual={proyeccionActual}
        ignorarRestricciones={ignorarRestricciones}
        toggleCursoProyeccion={toggleCursoProyeccion}
        irSiguienteSemestre={irSiguienteSemestre}
        cambiarSemestre={cambiarSemestre}
        proyeccionesPreview={proyeccionesPreview}
        setIgnorarRestricciones={setIgnorarRestricciones}
        guardar={guardar}
        limpiarTodo={limpiarTodo}
        generarProyeccionAutomatica={generarProyeccionAutomatica}
        hasSeenTutorial={hasSeenTutorial}
      />
    </div>
  );
}

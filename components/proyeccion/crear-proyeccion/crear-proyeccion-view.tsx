"use client";

import { guardarProyeccion } from "@/src/actions/proyeccionActions";
import { Curso, CursoStatus } from "@/src/types/curso";
import { generarProyeccionOptima } from "@/src/utils/generarProyeccionOptima";
import {
  aprobarCursosInscritos,
  irSemestreAnterior,
  toggleCursoProyeccionActual,
  toggleEstadoCurso,
} from "@/src/utils/proyeccionUtils";
import {
  getSemestreActual,
  getSemestreSiguiente,
} from "@/src/utils/semestreUtils";
import { useEffect, useState } from "react";
import { EditorProyeccion } from "./editor/editor-proyeccion";
import { MallaCurricular } from "./malla-proyeccion";
import { ProyeccionPreview } from "./proyeccion-preview";

type CrearProyeccionViewProps = {
  cursos: Curso[];
};

export function NuevaProyeccionView(cursosProp: CrearProyeccionViewProps) {
  const [cursos, setCursos] = useState<Curso[]>(cursosProp.cursos);

  useEffect(() => {
    setCursos(cursosProp.cursos);
  }, [cursosProp.cursos]);

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

  function handleCambiarSemestre(semestreObjetivo: string) {
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

  return (
    <div className={`h-[calc(100vh-2.5rem)] flex flex-col`}>
      <div className="flex flex-[2] min-h-0">
        <MallaCurricular cursos={cursos} onCursoClick={toggleCursoProyeccion} />
        <ProyeccionPreview proyeccionesPreview={proyeccionesPreview} />
      </div>

      <EditorProyeccion
        cursos={cursos}
        semestres={semestres}
        semestreActual={semestreActual}
        proyeccionActual={proyeccionActual}
        proyeccionesPreview={proyeccionesPreview}
        onAgregarCurso={toggleCursoProyeccion}
        onRemoverCurso={toggleCursoProyeccion}
        onSiguienteSemestre={irSiguienteSemestre}
        onCambiarSemestre={handleCambiarSemestre}
        onGuardar={handleGuardarProyeccion}
        onLimpiar={() => {}}
      />
    </div>
  );
}

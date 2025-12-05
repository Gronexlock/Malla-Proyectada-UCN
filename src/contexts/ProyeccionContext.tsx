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
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "sonner";

type ProyeccionContextType = {
  cursos: Curso[];
  semestres: string[];
  semestreActual: string;
  proyeccionActual: Curso[];
  proyeccionesPreview: Record<string, Curso[]>;
  proyeccionesPorSemestre: Record<string, Curso[]>;
  ignorarRestricciones: boolean;

  setIgnorarRestricciones: (value: boolean) => void;
  toggleCursoProyeccion: (curso: Curso) => void;
  irSiguienteSemestre: () => void;
  cambiarSemestre: (semestre: string) => void;
  guardar: () => Promise<void>;
  limpiarTodo: () => void;
  generarProyeccionAutomatica: () => void;
};

const ProyeccionContext = createContext<ProyeccionContextType | undefined>(
  undefined
);

type ProyeccionProviderProps = {
  children: ReactNode;
  cursosIniciales: Curso[];
};

export function ProyeccionProvider({
  children,
  cursosIniciales,
}: ProyeccionProviderProps) {
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
    const proyeccionGenerada = generarProyeccionOptima(cursos);
    const semestresGenerados = Object.keys(proyeccionGenerada).sort();

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
      cursos,
      proyeccionGenerada
    );
    setCursos(cursosActualizados);
  }

  return (
    <ProyeccionContext.Provider
      value={{
        cursos,
        semestres,
        semestreActual,
        proyeccionActual,
        proyeccionesPreview,
        proyeccionesPorSemestre,
        ignorarRestricciones,
        setIgnorarRestricciones,
        toggleCursoProyeccion,
        irSiguienteSemestre,
        cambiarSemestre,
        guardar,
        limpiarTodo,
        generarProyeccionAutomatica,
      }}
    >
      {children}
    </ProyeccionContext.Provider>
  );
}

export function useProyeccion() {
  const context = useContext(ProyeccionContext);
  if (!context) {
    throw new Error("useProyeccion must be used within a ProyeccionProvider");
  }
  return context;
}

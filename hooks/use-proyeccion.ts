import { CursoAvance, CursoMalla } from "@/src/types/curso";
import { useState, useEffect } from "react";
import { Carrera } from "@/src/types/carrera";
import { getCursosPorAnio, getCursosPorNivel } from "@/src/utils/curso";
import { getSemestreActual, getSemestreSiguiente } from "@/src/utils/semestre";
import { useUserStore } from "@/src/store/useUserStore";
import { Proyeccion } from "@/src/types/proyeccion";

export function useCrearProyeccion(
  carrera: Carrera,
  rut: string,
  ignorarRestricciones: boolean
) {
  const [cursos, setCursos] = useState<CursoMalla[]>([]);
  const [avance, setAvance] = useState<CursoAvance[]>([]);
  const [loading, setLoading] = useState(true);
  const [altura, setAltura] = useState(0);
  const cursosPorNivel = getCursosPorNivel(cursos);
  const cursosPorAnio = getCursosPorAnio(cursosPorNivel);
  const { proyecciones, setProyecciones } = useUserStore();
  const [semestres, setSemestres] = useState([
    getSemestreSiguiente(getSemestreActual()),
  ]);
  const [semestreIndex, setSemestreIndex] = useState(0);
  const semestreActual = semestres[semestreIndex];
  const [proyeccionesPorSemestre, setProyeccionesPorSemestre] = useState<
    Record<string, CursoMalla[]>
  >({});
  const proyeccionActual = proyeccionesPorSemestre[semestreActual] || [];
  const [avancePorSemestre, setAvancePorSemestre] = useState<
    Record<string, CursoAvance[]>
  >({});
  const LIMITE_CREDITOS = 30;

  const callbackRef = (node: HTMLDivElement | null) => {
    if (node) setAltura(node.offsetHeight);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!carrera || !rut) return;
      setLoading(true);

      try {
        const [cursosResponse, avanceResponse] = await Promise.all([
          fetch(`/api/mallas/?codigo=${carrera.codigo}-${carrera.catalogo}`),
          fetch(`/api/avance/?rut=${rut}&codCarrera=${carrera.codigo}`),
        ]);
        const [cursosData, avanceData] = await Promise.all([
          cursosResponse.json(),
          avanceResponse.json(),
        ]);
        setCursos(cursosData);
        setAvance(avanceData);
        actualizarAvance();
      } catch (error) {
        console.error("Error fetching data:", error);
        setCursos([]);
        setAvance([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [carrera, rut]);

  function agregarCursoAlAvance(codigo: string) {
    setAvance((prev) => [...prev, { course: codigo, status: "INSCRITO" }]);
  }

  function eliminarInscripcion(codigo: string) {
    const curso = avance.find(
      (c) => c.course === codigo && c.status === "INSCRITO"
    );
    if (curso) {
      setAvance((prev) => prev.filter((c) => c.course !== codigo));
    }
  }

  function actualizarAvance() {
    setAvance((prev) =>
      prev.map((curso) =>
        curso.status === "INSCRITO" ? { ...curso, status: "APROBADO" } : curso
      )
    );
  }

  function guardarProyecciones() {
    const maxId = proyecciones.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const proyeccionesNueva: Proyeccion = {
      id: maxId + 1,
      proyecciones: [],
    };

    Object.keys(proyeccionesPorSemestre).forEach((semestre) => {
      proyeccionesNueva.proyecciones.push({
        semestre,
        cursos: proyeccionesPorSemestre[semestre].map((curso) => ({
          codigo: curso.codigo,
          asignatura: curso.asignatura,
          creditos: curso.creditos,
          semestre,
        })),
      });
    });
    setProyecciones([...proyecciones, proyeccionesNueva]);
  }

  function toggleCursoProyeccion(curso: CursoMalla) {
    setProyeccionesPorSemestre((prev) => {
      const proyeccionActual = prev[semestreActual] || [];
      const isCursoSelected = proyeccionActual.some(
        (c) => c.codigo === curso.codigo
      );

      if (isCursoSelected) {
        eliminarInscripcion(curso.codigo);
      } else {
        agregarCursoAlAvance(curso.codigo);
      }

      return {
        ...prev,
        [semestreActual]: isCursoSelected
          ? proyeccionActual.filter((c) => c.codigo !== curso.codigo)
          : [...proyeccionActual, curso],
      };
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
    actualizarAvance();
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
      setAvance(avancePorSemestre[anteriorSemestre] || []);
      setSemestreIndex(semestreIndex - 1);
    }
  }

  function getCreditosSemestreActual(): number {
    return proyeccionActual.reduce((total, curso) => total + curso.creditos, 0);
  }

  function cumplePrerrequisitos(curso: CursoMalla): boolean {
    if (!curso.prereq || curso.prereq.length === 0 || ignorarRestricciones)
      return true;
    return curso.prereq.every((pre) =>
      avance.some((a) => a.course === pre.codigo && a.status === "APROBADO")
    );
  }

  function getCursosBloqueantes(curso: CursoMalla) {
    if (getCursoStatus(curso.codigo) === "APROBADO") return [];
    const aprobados = avance
      .filter((a) => a.status === "APROBADO")
      .map((a) => a.course);
    return curso.prereq.filter((pre) => !aprobados.includes(pre.codigo));
  }

  function getCursoStatus(codigo: string): CursoAvance["status"] | "PENDIENTE" {
    const cursoAvance = avance.filter((curso) => curso.course === codigo);
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

  return {
    cursos,
    avance,
    loading,
    altura,
    setAltura,
    cursosPorNivel,
    cursosPorAnio,
    proyecciones,
    setProyecciones,
    semestres,
    semestreIndex,
    semestreActual,
    proyeccionesPorSemestre,
    setProyeccionesPorSemestre,
    proyeccionActual,
    LIMITE_CREDITOS,
    callbackRef,
    guardarProyecciones,
    toggleCursoProyeccion,
    isAlreadySelected,
    irSiguienteSemestre,
    irSemestreAnterior,
    getCreditosSemestreActual,
    cumplePrerrequisitos,
    getCursosBloqueantes,
    getCursoStatus,
  };
}

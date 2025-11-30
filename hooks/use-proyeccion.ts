import { Carrera } from "@/src/types/carrera";
import { CursoAvance, CursoMalla } from "@/src/types/curso";
import {
  getSemestreActual,
  getSemestreSiguiente,
} from "@/src/utils/semestreUtils";
import { useEffect, useState } from "react";

export function useCrearProyeccion(carrera: Carrera, rut: string) {
  const [cursos, setCursos] = useState<CursoMalla[]>([]);
  const [avance, setAvance] = useState<CursoAvance[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [ignorarRestricciones, setIgnorarRestricciones] = useState(false);

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

        const practicas = ["ECIN-08606", "ECIN-08616", "ECIN-08266"];
        const practicaIdx = cursosData.findIndex((curso: CursoMalla) =>
          practicas.includes(curso.codigo)
        );
        if (practicaIdx !== -1) cursosData.splice(practicaIdx, 1);

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

  async function guardarProyecciones() {
    try {
      const response = await fetch("/api/proyecciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estudianteRut: rut,
          carreraCodigo: carrera.codigo,
          proyecciones: proyeccionesPorSemestre,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar las proyecciones");
      }
    } catch (error) {
      console.error("Error guardando proyecciones:", error);
    }
  }

  function toggleCursoProyeccion(curso: CursoMalla) {
    setProyeccionesPorSemestre((prev) => {
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
    loading,
    semestreIndex,
    semestreActual,
    proyeccionActual,
    LIMITE_CREDITOS,
    guardarProyecciones,
    toggleCursoProyeccion,
    isAlreadySelected,
    irSiguienteSemestre,
    irSemestreAnterior,
    getCreditosSemestreActual,
    cumplePrerrequisitos,
    getCursosBloqueantes,
    getCursoStatus,
    ignorarRestricciones,
    setIgnorarRestricciones,
  };
}

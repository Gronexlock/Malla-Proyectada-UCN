import { fetchProyecciones } from "../actions/proyeccionActions";
import { Carrera } from "../types/carrera";
import { Curso, CursoStatus } from "../types/curso";
import { Proyeccion } from "../types/proyeccion";
import { getCursosPorNivel, getCursoStatus, getMalla } from "./cursosUtils";

/**
 * Obtiene las proyecciones de un estudiante para una carrera específica desde
 * la base de datos.
 * @param carrera La carrera del estudiante.
 * @returns La lista de proyecciones del estudiante.
 */
export async function getProyecciones(carrera: Carrera): Promise<Proyeccion[]> {
  const [malla, proyeccionesDB] = await Promise.all([
    getMalla(carrera),
    fetchProyecciones(),
  ]);
  const cursosMap = new Map(malla.map((c) => [c.codigo, c]));

  return proyeccionesDB.map((proyeccionDB) => {
    const cursosPorSemestre = new Map<string, Curso[]>();
    proyeccionDB.cursos.forEach((item) => {
      const curso = cursosMap.get(item.cursoCodigo);
      if (curso) {
        const cursos = cursosPorSemestre.get(item.semestre) || [];
        cursos.push(curso);
        cursosPorSemestre.set(item.semestre, cursos);
      }
    });
    const semestres = Array.from(cursosPorSemestre.entries()).map(
      ([semestre, cursos]) => ({
        semestre,
        cursos,
      })
    );
    semestres.sort((a, b) => a.semestre.localeCompare(b.semestre));

    return {
      id: proyeccionDB.id,
      carrera: proyeccionDB.carreraCodigo,
      semestres,
    };
  });
}

/**
 * Agrega el estado de aprobado a los cursos que están inscritos.
 * @param cursos Lista de cursos a actualizar.
 * @returns Lista de cursos actualizados.
 */
export function aprobarCursosInscritos(cursos: Curso[]): Curso[] {
  const cursosActualizados: Curso[] = [];
  for (const curso of cursos) {
    if (curso.status.includes(CursoStatus.INSCRITO)) {
      curso.status.push(CursoStatus.APROBADO);
    }
    cursosActualizados.push(curso);
  }
  return cursosActualizados;
}

/**
 * Alterna el estado de inscrito de un curso en la lista de cursos.
 * Si el curso está inscrito, se elimina el estado de inscrito.
 * Si el curso no está inscrito, se agrega el estado de inscrito.
 * @param cursos Lista de cursos a actualizar.
 * @param cursoToToggle Curso cuyo estado se desea alternar.
 * @returns Lista de cursos actualizados.
 */
export function toggleEstadoCurso(
  cursos: Curso[],
  cursoToToggle: Curso
): Curso[] {
  const cursosActualizados: Curso[] = [];
  for (const curso of cursos) {
    if (curso.codigo === cursoToToggle.codigo) {
      const isInscrito = curso.status.includes(CursoStatus.INSCRITO);
      if (isInscrito) {
        curso.status = curso.status.filter((s) => s !== CursoStatus.INSCRITO);
      } else {
        curso.status.push(CursoStatus.INSCRITO);
      }
    }
    cursosActualizados.push(curso);
  }
  return cursosActualizados;
}

/**
 * Alterna la presencia de un curso en la proyección actual.
 * Si el curso se encuentra en la proyección, lo elimina.
 * Si el curso no se encuentra, lo agrega.
 * @param cursoToToggle El curso a alternar.
 * @param proyeccionActual La proyección a actualizar.
 * @returns La proyección actualizada.
 */
export function toggleCursoProyeccionActual(
  cursoToToggle: Curso,
  proyeccionActual: Curso[]
): Curso[] {
  const isInProyeccion = proyeccionActual.some(
    (c) => c.codigo === cursoToToggle.codigo
  );
  let nuevaProyeccion: Curso[];

  if (isInProyeccion) {
    nuevaProyeccion = proyeccionActual.filter(
      (c) => c.codigo !== cursoToToggle.codigo
    );
  } else {
    nuevaProyeccion = [...proyeccionActual, cursoToToggle];
  }
  return nuevaProyeccion;
}

/**
 * Calcula la cantidad de créditos totales de una proyección semestral de cursos.
 * @param proyeccion Lista de cursos en la proyección semestral.
 * @returns Cantidad total de créditos.
 */
export function getCreditosProyeccion(proyeccion: Curso[]): number {
  return proyeccion.reduce((total, curso) => total + curso.creditos, 0);
}

/**
 * Calcula la cantidad de créditos totales de la proyección completa.
 * @param proyeccion Lista de cursos en la proyección, organizada por semestres.
 * @returns Cantidad total de créditos.
 */
export function getCreditosProyeccionTotal(
  proyeccion: Record<string, Curso[]>
): number {
  let totalCreditos = 0;
  Object.values(proyeccion).forEach((cursos) => {
    totalCreditos += getCreditosProyeccion(cursos);
  });
  return totalCreditos;
}

/**
 * Obtiene la cantidad de semestres en una proyección de cursos.
 * @param proyeccion Proyección de cursos organizada por semestres.
 * @returns Cantidad de semestres en la proyección.
 */
export function getCantidadSemestresProyeccion(
  proyeccion: Record<string, Curso[]>
): number {
  return Object.keys(proyeccion).length;
}

/**
 * Obtiene la lista de cursos que bloquean la inscripción de un curso específico,
 * esto es, los prerrequisitos que aún no han sido aprobados.
 * @param curso Curso objetivo.
 * @param cursos Lista de todos los cursos disponibles.
 * @returns Lista de cursos que bloquean la inscripción del curso objetivo.
 */
export function getCursosBloqueantes(curso: Curso, cursos: Curso[]): Curso[] {
  if (curso.status.includes(CursoStatus.APROBADO)) {
    return [];
  }
  const bloqueantes: Curso[] = [];
  for (const prereq of curso.prerrequisitos) {
    const cursoAvance = cursos.find((c) => c.codigo === prereq.codigo);
    if (cursoAvance && !cursoAvance.status.includes(CursoStatus.APROBADO)) {
      bloqueantes.push(cursoAvance);
    }
  }
  return bloqueantes;
}

/**
 * Obtiene el nivel académico del estudiante basado en los cursos aprobados. El nivel
 * se obtiene buscando el ramo más atrasado que no tenga aprobado.
 * @param cursos
 */
export function getNivelEstudiante(cursos: Curso[]) {
  const cursosPorNivel: Record<string, Curso[]> = getCursosPorNivel(cursos);
  const sorted = Object.entries(cursosPorNivel)
    .map(([nivel, cursos]) => ({ nivel: Number(nivel), cursos }))
    .sort((a, b) => a.nivel - b.nivel);

  for (const { nivel, cursos } of sorted) {
    const allAprobados = cursos.every((curso) =>
      curso.status.includes(CursoStatus.APROBADO)
    );
    if (!allAprobados) {
      return nivel;
    }
  }
  return 0;
}

/**
 * Verifica si un curso está disperso para un nivel de estudiante dado. Se
 * considera disperso si el nivel del curso es mayor en más de 2 niveles
 * que el nivel del estudiante, y el curso no está aprobado.
 * @param curso El curso a evaluar.
 * @param nivelEstudiante El nivel académico del estudiante.
 * @returns True si el curso está disperso, false en caso contrario.
 */
export function isDisperso(curso: Curso, nivelEstudiante: number): boolean {
  if (
    curso.nivel <= nivelEstudiante ||
    curso.status.includes(CursoStatus.APROBADO)
  ) {
    return false;
  }
  return curso.nivel - nivelEstudiante > 2;
}

/**
 * Calcula el porcentaje de avance académico basado en los cursos aprobados.
 * @param cursos Lista de cursos del estudiante.
 * @returns Porcentaje de avance académico.
 */
export function calcularPorcentajeAvance(cursos: Curso[]): number {
  const cantidadAprobados = cursos.filter((curso) =>
    curso.status.includes(CursoStatus.APROBADO)
  ).length;
  return Math.floor((cantidadAprobados / cursos.length) * 100);
}

/** Obtiene el último semestre de una proyección de cursos.
 * @param proyeccion Proyección de cursos organizada por semestres.
 * @returns El último semestre en formato string.
 */
export function getUltimoSemestreProyeccion(
  proyeccion: Record<string, Curso[]>
): string | undefined {
  const semestres = Object.keys(proyeccion);
  if (semestres.length === 0) {
    return undefined;
  }
  return semestres[semestres.length - 1];
}

/**
 * Obtiene la cantidad de cursos pendientes (no aprobados).
 * @param cursos Lista de cursos del estudiante.
 * @returns Cantidad de cursos pendientes (no aprobados).
 */
export function getCantidadCursosPendientes(cursos: Curso[]): number {
  return cursos.filter((curso) => !curso.status.includes(CursoStatus.APROBADO))
    .length;
}

/**
 * Obtiene la cantidad de créditos restantes (de cursos no aprobados).
 * @param cursos Lista de cursos del estudiante.
 * @returns Cantidad de créditos restantes (de cursos no aprobados).
 */
export function getCantidadCreditosRestantes(cursos: Curso[]): number {
  const cursosPendientes = cursos.filter(
    (curso) => !curso.status.includes(CursoStatus.APROBADO)
  );
  return cursosPendientes.reduce((total, curso) => total + curso.creditos, 0);
}

/**
 * Obtiene la lista de cursos disponibles para proyección. Un curso está disponible si
 * no está aprobado, todos sus prerrequisitos están aprobados, y no está disperso.
 * @param cursos Lista de cursos en la malla curricular del estudiante.
 * @returns Lista de cursos disponibles para proyección.
 */
export function getCursosDisponibles(cursos: Curso[]): Curso[] {
  return cursos.filter(
    (curso) =>
      getCursoStatus(curso) !== CursoStatus.APROBADO &&
      getCursoStatus(curso) !== CursoStatus.INSCRITO &&
      getCursosBloqueantes(curso, cursos).length === 0 &&
      !isDisperso(curso, getNivelEstudiante(cursos))
  );
}

/**
 * Retrocede la proyección a un semestre objetivo, eliminando todos los semestres
 * y cursos proyectados posteriores a él.
 * @param semestreObjetivo El semestre al que se desea retroceder.
 * @param semestres El array actual de semestres en la proyección.
 * @param cursos La lista de todos los cursos.
 * @param proyeccionesPorSemestre El registro de cursos proyectados por semestre.
 * @returns Un objeto con los nuevos estados de cursos, semestres y proyecciones.
 */
export function irSemestreAnterior(
  semestreObjetivo: string,
  semestres: string[],
  cursos: Curso[],
  proyeccionesPorSemestre: Record<string, Curso[]>
) {
  const indexObjetivo = semestres.indexOf(semestreObjetivo);
  let indexActual = semestres.length - 1;

  while (indexActual >= indexObjetivo) {
    const proyeccionActual = proyeccionesPorSemestre[semestres[indexActual]];
    proyeccionActual.forEach((cursoProyectado) => {
      const cursoMalla = cursos.find(
        (c) => c.codigo === cursoProyectado.codigo
      );
      if (cursoMalla) {
        cursoMalla.status = cursoMalla.status.filter(
          (s) => s !== CursoStatus.APROBADO
        );
        if (indexActual !== indexObjetivo) {
          cursoMalla.status = cursoMalla.status.filter(
            (s) => s !== CursoStatus.INSCRITO
          );
        }
      }
    });
    if (indexActual !== indexObjetivo) {
      delete proyeccionesPorSemestre[semestres[indexActual]];
      semestres.pop();
    }
    indexActual--;
  }
  const llaves = Object.keys(proyeccionesPorSemestre);
  const ultimaLlave = llaves[llaves.length - 1];
  const nuevaPreview = { ...proyeccionesPorSemestre };
  delete nuevaPreview[ultimaLlave];

  return {
    nuevosCursos: cursos,
    nuevosSemestres: semestres,
    nuevasProyecciones: proyeccionesPorSemestre,
    nuevaPreview: nuevaPreview,
  };
}

/**
 * Verifica si una proyección está completa, es decir, si todos los cursos disponibles
 * en la malla curricular están aprobados.
 * @param cursos La lista de todos los cursos en la malla curricular.
 * @returns True si la proyección está completa, false en caso contrario.
 */
export function isProyeccionCompleta(cursos: Curso[]): boolean {
  return cursos.every((curso) => curso.status.includes(CursoStatus.APROBADO));
}

/**
 * Remueve el estado de inscrito de todos los cursos en la lista.
 * @param cursos La lista de cursos de la malla.
 * @returns Una lista de cursos con el estado de inscrito removido.
 */
export function desinscribirCursos(cursos: Curso[]): Curso[] {
  return cursos.map((curso) => {
    if (curso.status.includes(CursoStatus.INSCRITO)) {
      curso.status = curso.status.filter((s) => s !== CursoStatus.INSCRITO);
    }
    return curso;
  });
}

/**
 * Remueve todos los cursos inscritos de la proyección actual.
 * @param proyeccionesPorSemestre El registro de cursos proyectados por semestre.
 * @returns El registro actualizado sin los cursos inscritos del último semestre.
 */
export function limpiarProyeccionActual(
  proyeccionesPorSemestre: Record<string, Curso[]>
): Record<string, Curso[]> {
  const keys = Object.keys(proyeccionesPorSemestre);
  if (keys.length === 0) {
    return proyeccionesPorSemestre;
  }
  const ultimaLlave = keys[keys.length - 1];
  delete proyeccionesPorSemestre[ultimaLlave];
  return proyeccionesPorSemestre;
}

/**
 * Reverts the status of courses when going back a semester.
 * Courses in the previous projection go back to INSCRITO (remove APROBADO).
 * Courses in the current projection (which is being discarded) lose INSCRITO status.
 */
export function inscribirCursosAprobados(
  cursos: Curso[],
  proyeccionActual: Curso[],
  proyeccionAnterior: Curso[]
): Curso[] {
  return cursos.map((curso) => {
    // Revert previous projection courses to INSCRITO (remove APROBADO)
    if (proyeccionAnterior.some((c) => c.codigo === curso.codigo)) {
      return {
        ...curso,
        status: curso.status.filter((s) => s !== CursoStatus.APROBADO),
      };
    }
    // Revert current projection courses (remove INSCRITO)
    if (proyeccionActual.some((c) => c.codigo === curso.codigo)) {
      return {
        ...curso,
        status: curso.status.filter((s) => s !== CursoStatus.INSCRITO),
      };
    }
    return curso;
  });
}

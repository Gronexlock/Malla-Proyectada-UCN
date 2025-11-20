import { Curso, CursoStatus } from "../types/curso";

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
 * Elimina el estado de inscrito de los cursos que están en la proyección actual.
 * Elimina el estado de aprobado de los cursos que están en la proyección anterior.
 * @param cursos Lista de cursos a actualizar.
 * @param proyeccionActual Lista de cursos en la proyección actual.
 * @param proyeccionAnterior Lista de cursos en la proyección anterior.
 * @returns Lista de cursos actualizados.
 */
export function inscribirCursosAprobados(
  cursos: Curso[],
  proyeccionActual: Curso[],
  proyeccionAnterior: Curso[]
): Curso[] {
  const cursosActualizados: Curso[] = [];
  for (const curso of cursos) {
    if (proyeccionActual.some((c) => c.codigo === curso.codigo)) {
      curso.status = curso.status.filter((s) => s !== CursoStatus.INSCRITO);
    }
    if (proyeccionAnterior.some((c) => c.codigo === curso.codigo)) {
      curso.status = curso.status.filter((s) => s !== CursoStatus.APROBADO);
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
 * Calcula la cantidad de créditos totales de una proyección de cursos.
 * @param proyeccion Lista de cursos en la proyección.
 * @returns Cantidad total de créditos.
 */
export function getCreditosProyeccion(proyeccion: Curso[]): number {
  return proyeccion.reduce((total, curso) => total + curso.creditos, 0);
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

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
 * Inscribe los cursos aprobados que aparezcan en la proyección.
 * @param cursos Lista de cursos a actualizar.
 * @param proyeccion Lista de cursos en la proyección.
 * @returns Lista de cursos actualizados.
 */
export function inscribirCursosAprobados(
  cursos: Curso[],
  proyeccion: Curso[]
): Curso[] {
  const cursosActualizados: Curso[] = [];
  for (const curso of cursos) {
    if (proyeccion.some((c) => c.codigo === curso.codigo)) {
      curso.status = curso.status.filter((s) => s !== CursoStatus.APROBADO);
    }
    cursosActualizados.push(curso);
  }
  return cursosActualizados;
}

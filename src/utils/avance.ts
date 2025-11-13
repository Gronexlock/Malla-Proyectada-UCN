import { CursoAvance } from "../types/curso";

/**
 * Obtiene el estado de un curso basado en el avance del estudiante. Si existen múltiples
 * instancias de un curso, se determina el estado final siguiendo el siguiente orden:
 * REPROBADO < INSCRITO < APROBADO.
 * Si no existe el curso en el avance entonces el curso está PENDIENTE.
 * @param codigo Código del curso.
 * @param avance Lista de cursos que representan el avance del estudiante.
 * @returns El estado del curso.
 */
export function getCursoStatus(
  codigo: string,
  avance: CursoAvance[]
): CursoAvance["status"] {
  const cursoAvance = avance.filter((curso) => curso.course === codigo);
  if (cursoAvance.length === 0) return "PENDIENTE";
  if (cursoAvance.length === 1) return cursoAvance[0].status;
  else {
    const statuses = cursoAvance.map((curso) => curso.status);
    if (statuses.includes("APROBADO")) return "APROBADO";
    if (statuses.includes("INSCRITO")) return "INSCRITO";
    return "REPROBADO";
  }
}

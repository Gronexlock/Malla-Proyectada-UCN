import { Curso } from "../types/curso";

/**
 * Actualiza el avance del estudiante, cambiando todos los cursos con estado
 * "INSCRITO" a estado "APROBADO".
 * @param cursos Lista de cursos del avance del estudiante.
 * @returns Lista de cursos actualizada.
 */
export function actualizarAvance(cursos: Curso[]): Curso[] {
  return cursos.map((curso) =>
    curso.status === "INSCRITO" ? { ...curso, status: "APROBADO" } : curso
  );
}

/**
 * Agrega un curso con el código dado al avance del estudiante, cambiando
 * su estado a "INSCRITO".
 * @param cursos Lista de cursos del avance del estudiante.
 * @param codigo Código del curso que se agregará al avance.
 * @returns Lista de cursos actualizada.
 */
export function agregarCursoAlAvance(cursos: Curso[], codigo: string): Curso[] {
  return cursos.map((curso) =>
    curso.codigo === codigo ? { ...curso, status: "INSCRITO" } : curso
  );
}

/**
 * Elimina un curso con el código dado del avance del estudiante, cambiando
 * su estado a "PENDIENTE".
 * @param cursos Lista de cursos del avance del estudiante.
 * @param codigo Código del curso que se eliminará del avance.
 * @returns Lista de cursos actualizada.
 */
export function eliminarInscripcion(cursos: Curso[], codigo: string): Curso[] {
  return cursos.map((curso) =>
    curso.codigo === codigo ? { ...curso, status: "PENDIENTE" } : curso
  );
}

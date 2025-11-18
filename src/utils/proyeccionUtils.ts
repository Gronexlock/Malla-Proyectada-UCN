import { Curso } from "../types/curso";

/**
 * Actualiza el avance del estudiante, cambiando todos los cursos con estado
 * "INSCRITO" a estado "APROBADO".
 * @param avance Lista de cursos que representan el avance curricular del estudiante.
 * @returns Una nueva lista de cursos con los estados actualizados.
 */
export function actualizarAvance(avance: Curso[]): Curso[] {
  return avance.map((curso) =>
    curso.status === "INSCRITO" ? { ...curso, status: "APROBADO" } : curso
  );
}

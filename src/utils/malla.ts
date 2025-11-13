import { Curso } from "../types/curso";

/**
 * Agrupa los cursos por nivel.
 *
 * @param cursos Lista de cursos a agrupar.
 * @returns Un objeto donde las claves son los niveles y los valores son listas de cursos.
 */
export function getCursosPorNivel(cursos: Curso[]): Record<number, Curso[]> {
  const cursosPorNivel: Record<number, Curso[]> = {};
  cursos.forEach((curso) => {
    if (!cursosPorNivel[curso.nivel]) {
      cursosPorNivel[curso.nivel] = [];
    }
    cursosPorNivel[curso.nivel].push(curso);
  });
  return cursosPorNivel;
}

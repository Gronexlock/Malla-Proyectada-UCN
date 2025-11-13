import { CursoMalla } from "../types/curso";

/**
 * Agrupa los cursos por nivel.
 *
 * @param cursos Lista de cursos a agrupar.
 * @returns Un objeto donde las claves son los niveles y los valores son listas de cursos.
 */
export function getCursosPorNivel(
  cursos: CursoMalla[]
): Record<number, CursoMalla[]> {
  const cursosPorNivel: Record<number, CursoMalla[]> = {};
  cursos.forEach((curso) => {
    if (!cursosPorNivel[curso.nivel]) {
      cursosPorNivel[curso.nivel] = [];
    }
    cursosPorNivel[curso.nivel].push(curso);
  });
  return cursosPorNivel;
}

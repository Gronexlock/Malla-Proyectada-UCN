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

/**
 * Agrupa los niveles de cursos por año.
 *
 * @param cursosPorNivel Objeto con cursos agrupados por nivel.
 * @returns Un objeto donde las claves son los años y los valores son listas de niveles.
 */
export function getCursosPorAnio(
  cursosPorNivel: Record<number, CursoMalla[]>
): Record<number, number[]> {
  const cursosPorAnio: Record<number, number[]> = {};
  Object.keys(cursosPorNivel).forEach((level) => {
    const anio = Math.ceil(Number(level) / 2);
    if (!cursosPorAnio[anio]) cursosPorAnio[anio] = [];
    cursosPorAnio[anio].push(Number(level));
  });
  return cursosPorAnio;
}

/**
 * Formatea los prerrequisitos de un curso.
 *
 * @param prereq Cadena de prerrequisitos separados por coma.
 * @param cursos Lista de cursos para buscar nombres.
 * @returns Lista de objetos con código y nombre de asignatura de los prerrequisitos.
 */
export function formatPrereq(
  prereq: string,
  cursos: CursoMalla[]
): { codigo: string; asignatura: string }[] {
  const prereqList = prereq
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p !== "");
  const formatted = prereqList.map((p) => {
    const curso = cursos.find((c) => c.codigo === p);
    return {
      codigo: p,
      asignatura: curso ? curso.asignatura : p,
    };
  });
  return formatted;
}

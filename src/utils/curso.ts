import { CursoMalla } from "../types/curso";

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

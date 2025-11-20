import { Curso, CursoStatus } from "../types/curso";

export function actualizarAvance(cursos: Curso[]): Curso[] {
  const cursosActualizados: Curso[] = [];
  for (const curso of cursos) {
    if (curso.status.includes(CursoStatus.INSCRITO)) {
      curso.status.push(CursoStatus.APROBADO);
    }
    cursosActualizados.push(curso);
  }
  return cursosActualizados;
}

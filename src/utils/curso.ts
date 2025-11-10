import { CursoAvance, CursoMalla, Status } from "../types/curso";

export type CursosPorNivel = Record<number, CursoMalla[]>;
export type CursosPorAnio = Record<number, number[]>;
export type CursosPorSemestre = Record<string, CursoAvance[]>;

export function getCursosPorNivel(cursos: CursoMalla[]): CursosPorNivel {
  const cursosPorNivel: CursosPorNivel = {};
  cursos.forEach((curso) => {
    if (!cursosPorNivel[curso.nivel]) {
      cursosPorNivel[curso.nivel] = [];
    }
    cursosPorNivel[curso.nivel].push(curso);
  });
  return cursosPorNivel;
}

export function getCursosPorAnio(
  cursosPorNivel: CursosPorNivel
): CursosPorAnio {
  const cursosPorAnio: CursosPorAnio = {};
  Object.keys(cursosPorNivel).forEach((level) => {
    const anio = Math.ceil(Number(level) / 2);
    if (!cursosPorAnio[anio]) cursosPorAnio[anio] = [];
    cursosPorAnio[anio].push(Number(level));
  });
  return cursosPorAnio;
}

export function getCursoStatus(codigo: string, avance: CursoAvance[]): Status {
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

export function agruparPorSemestre(cursos: CursoAvance[]): CursosPorSemestre {
  return cursos.reduce<CursosPorSemestre>((acc, curso) => {
    const periodo = curso.period;
    if (!acc[periodo]) {
      acc[periodo] = [];
    }
    acc[periodo].push(curso);
    return acc;
  }, {});
}

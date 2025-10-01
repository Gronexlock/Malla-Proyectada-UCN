import { CursoAvance } from "../types/curso";

export function getCursoStatus(
  codigo: string,
  avance: CursoAvance[]
): CursoAvance["status"] | "PENDIENTE" {
  const cursoAvance = avance.filter((curso) => curso.course === codigo);
  if (cursoAvance.length === 0) return "PENDIENTE";
  if (cursoAvance.length === 1) {
    if (cursoAvance[0].status !== "REPROBADO") return "APROBADO";
    return "REPROBADO";
  } else {
    const statuses = cursoAvance.map((curso) => curso.status);
    if (statuses.includes("APROBADO") || statuses.includes("INSCRITO"))
      return "APROBADO";
    return "REPROBADO";
  }
}

export enum CursoStatus {
  APROBADO = "APROBADO",
  PENDIENTE = "PENDIENTE",
  INSCRITO = "INSCRITO",
  REPROBADO = "REPROBADO",
  BLOQUEADO = "BLOQUEADO",
}

export type Curso = {
  codigo: string;
  asignatura: string;
  creditos: number;
  nivel: number;
  prerrequisitos: Curso[];
  nrc: string;
  periodo: string;
  status: CursoStatus[];
};

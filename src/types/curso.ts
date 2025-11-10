export interface CursoMalla {
  codigo: string;
  asignatura: string;
  creditos: number;
  nivel: number;
  prereq: {
    codigo: string;
    asignatura: string;
  }[];
}

export type Status = "APROBADO" | "REPROBADO" | "INSCRITO" | "PENDIENTE";

export interface CursoAvance {
  nrc: string;
  period: string;
  student: string;
  course: string;
  excluded: boolean;
  inscriptionType: string;
  status: Status;
}

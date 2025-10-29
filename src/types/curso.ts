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

export interface CursoAvance {
  nrc?: string;
  period?: string;
  student?: string;
  course: string;
  excluded?: boolean;
  inscriptionType?: string;
  status: "APROBADO" | "REPROBADO" | "INSCRITO" | "PENDIENTE";
}

export interface CursoProyeccion {
  asignatura: string;
  creditos: number;
  codigo: string;
}

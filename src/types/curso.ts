export interface CursoMalla {
  codigo: string;
  asignatura: string;
  creditos: number;
  nivel: number;
  prereq: string;
}

export interface CursoAvance {
  nrc: string;
  period: string;
  student: string;
  course: string;
  excluded: boolean;
  inscriptionType: string;
  status: "APROBADO" | "REPROBADO" | "INSCRITO";
}

export interface CursoProyeccion {
  codigo: string;
  semestre: string;
}

export type Curso = {
  codigo: string;
  asignatura: string;
  creditos: number;
  nivel: number;
  prerrequisitos: Curso[];
  nrc: string;
  periodo: string;
  status: "APROBADO" | "REPROBADO" | "INSCRITO" | "PENDIENTE" | "PROYECTADO";
};

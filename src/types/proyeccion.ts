import { Curso } from "./curso";

export type Proyeccion = {
  id: number;
  carrera: string;
  semestres: {
    semestre: string;
    cursos: Curso[];
  }[];
};

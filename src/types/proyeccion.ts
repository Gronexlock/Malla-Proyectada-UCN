import { CursoProyeccion } from "./curso";

export interface ProyeccionSemestre {
  cursos: CursoProyeccion[];
  semestre: string;
}

export interface Proyeccion {
  proyecciones: ProyeccionSemestre[];
}

import { CursoProyeccion } from "./curso";

// Proyeccion de un semestre
export interface ProyeccionSemestre {
  cursos: CursoProyeccion[];
  semestre: string;
}

// Proyeccion de toda la carrera
export interface Proyeccion {
  id: number;
  proyecciones: ProyeccionSemestre[];
}

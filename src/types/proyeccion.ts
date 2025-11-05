export interface Proyeccion {
  id: number;
  estudianteRut: string;
  carreraCodigo: string;
  cursos: {
    cursoCodigo: string;
    proyeccionId: number;
    semestre: string;
  }[];
}

export interface ProyeccionBySemestre {
  id: number;
  estudianteRut: string;
  carreraCodigo: string;
  semestres: {
    semestre: string;
    cursos: {
      cursoCodigo: string;
    }[];
  }[];
}

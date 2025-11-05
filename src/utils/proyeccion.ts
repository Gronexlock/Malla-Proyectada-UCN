import { Proyeccion } from "../types/proyeccion";

export function groupProyeccionBySemestres(proyeccion: Proyeccion) {
  const { id, estudianteRut, carreraCodigo, cursos } = proyeccion;

  const semestres = cursos.reduce((acc, curso) => {
    const { semestre, cursoCodigo } = curso;

    const semestreExistente = acc.find((s) => s.semestre === semestre);
    if (!semestreExistente) {
      acc.push({ semestre, cursos: [{ cursoCodigo }] });
    } else {
      semestreExistente.cursos.push({ cursoCodigo });
    }

    return acc;
  }, [] as { semestre: string; cursos: { cursoCodigo: string }[] }[]);

  return { id, estudianteRut, carreraCodigo, semestres };
}

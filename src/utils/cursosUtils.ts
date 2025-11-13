import { CursoMalla } from "../schemas/mallaSchema";
import { Curso } from "../types/curso";

/**
 * Obtiene los prerrequisitos de un curso como una lista de objetos Curso.
 * Los cursos resultantes no tienen prerrequisitos para evitar recursividad.
 * @param prereqString Cadena de prerrequisitos separada por comas.
 * @param cursosMalla Lista de cursos que retorna la API.
 * @returns Lista de objetos Curso.
 */
export function getPrerrequisitosAsCursos(
  prereqString: string,
  cursosMalla: CursoMalla[]
): Curso[] {
  const prereqCodes = prereqString.split(",");
  const prereqCursos: Curso[] = [];
  for (const code of prereqCodes) {
    const cursoMalla = cursosMalla.find((c) => c.codigo === code);
    const curso: Curso = {
      codigo: cursoMalla?.codigo || code,
      asignatura: cursoMalla?.asignatura || code,
      creditos: cursoMalla?.creditos || 0,
      nivel: cursoMalla?.nivel || 0,
      prerrequisitos: [], // Evitar recursividad
      nrc: "",
      periodo: "",
      status: "PENDIENTE",
    };
    prereqCursos.push(curso);
  }
  return prereqCursos;
}

/**
 * Obtiene la lista de cursos que retorna la API como una lista de objetos
 * Curso.
 * @param cursosMalla  Lista de cursos que retorna la API.
 * @returns Lista de objetos Curso.
 */
export function getCursosMallaAsCursos(cursosMalla: CursoMalla[]): Curso[] {
  const cursos: Curso[] = [];
  for (const cursoMalla of cursosMalla) {
    const curso: Curso = {
      codigo: cursoMalla.codigo,
      asignatura: cursoMalla.asignatura,
      creditos: cursoMalla.creditos,
      nivel: cursoMalla.nivel,
      prerrequisitos: getPrerrequisitosAsCursos(cursoMalla.prereq, cursosMalla),
      nrc: "",
      periodo: "",
      status: "PENDIENTE",
    };
    cursos.push(curso);
  }
  return cursos;
}

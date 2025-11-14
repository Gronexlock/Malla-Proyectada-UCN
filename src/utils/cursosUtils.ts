import { CursoAvance } from "../schemas/avanceSchema";
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
 * Obtiene la lista de cursos de la malla como una lista de objetos Curso.
 * @param cursosMalla  Lista de cursos de la malla.
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

/**
 * Obtiene la lista de cursos del avance del estudiante como una lista de
 * objetos Curso.
 * @param cursosAvance Lista de cursos del avance del estudiante.
 * @returns Lista de objetos Curso.
 */
export function getCursosAvanceAsCursos(cursosAvance: CursoAvance[]): Curso[] {
  const cursos: Curso[] = [];
  for (const cursoAvance of cursosAvance) {
    const curso: Curso = {
      codigo: cursoAvance.course,
      asignatura: "",
      creditos: 0,
      nivel: 0,
      prerrequisitos: [],
      nrc: cursoAvance.nrc,
      periodo: cursoAvance.period,
      status: cursoAvance.status,
    };
    cursos.push(curso);
  }
  return cursos;
}

/**
 * Obtiene el estado de un curso basado en el avance del estudiante. Si existen múltiples
 * instancias de un curso, se determina el estado final siguiendo el siguiente orden:
 * REPROBADO < INSCRITO < APROBADO.
 * Si no existe el curso en el avance entonces el curso está PENDIENTE.
 * @param codigo Código del curso.
 * @param avance Lista de cursos que representan el avance del estudiante.
 * @returns El estado del curso.
 */
export function getCursoStatus(
  codigo: string,
  avance: Curso[]
): Curso["status"] {
  const cursoAvance = avance.filter((curso) => curso.codigo === codigo);
  if (cursoAvance.length === 0) return "PENDIENTE";
  if (cursoAvance.length === 1) return cursoAvance[0].status;
  else {
    const statuses = cursoAvance.map((curso) => curso.status);
    if (statuses.includes("APROBADO")) return "APROBADO";
    if (statuses.includes("INSCRITO")) return "INSCRITO";
    return "REPROBADO";
  }
}

/**
 * Obtiene la lista de cursos de la malla combinada con el avance del estudiante.
 * Cada curso contendrá el estado correspondiente del avance.
 * @param cursosMalla Lista de cursos de la malla.
 * @param cursosAvance Lista de cursos del avance del estudiante.
 * @returns Lista de objetos Curso.
 */
export function getMallaConAvance(
  cursosMalla: Curso[],
  cursosAvance: Curso[]
): Curso[] {
  const cursos: Curso[] = cursosMalla.map((curso) => {
    return {
      ...curso,
      prerrequisitos: curso.prerrequisitos,
      status: getCursoStatus(curso.codigo, cursosAvance),
    };
  });
  return cursos;
}

import { fetchAvance } from "../actions/avanceActions";
import { fetchMalla } from "../actions/mallaActions";
import { CursoMalla } from "../schemas/mallaSchema";
import { Carrera } from "../types/carrera";
import { Curso, CursoStatus } from "../types/curso";

/**
 * Obtiene los prerrequisitos de un curso. Los cursos resultantes no
 * tienen prerrequisitos para evitar recursividad.
 * @param prereqString Cadena de prerrequisitos separada por comas.
 * @param cursosMalla Lista de cursos de la malla.
 * @returns Lista de cursos que representan los prerrequisitos.
 */
function getPrerrequisitosAsCursos(
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
      status: [CursoStatus.PENDIENTE],
    };
    prereqCursos.push(curso);
  }
  return prereqCursos;
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
function getFinalStatus(codigo: string, avance: Curso[]): CursoStatus {
  const cursoAvance = avance.filter((curso) => curso.codigo === codigo);
  if (cursoAvance.length === 0) return CursoStatus.PENDIENTE;
  if (cursoAvance.length === 1) return cursoAvance[0].status[0];
  else {
    const statuses = cursoAvance.map((curso) => curso.status[0]);
    if (statuses.includes(CursoStatus.APROBADO)) return CursoStatus.APROBADO;
    if (statuses.includes(CursoStatus.INSCRITO)) return CursoStatus.INSCRITO;
    return CursoStatus.REPROBADO;
  }
}

/**
 * Obtiene el estado principal de un curso basado en su lista de estados. El estado
 * se determina sigiuiendo el siguiente orden: APROBADO > INSCRITO > REPROBADO.
 * @param curso Curso del cual se desea obtener el estado principal.
 * @returns Estado principal del curso.
 */
export function getCursoStatus(curso: Curso): CursoStatus {
  if (curso.status.includes(CursoStatus.APROBADO)) return CursoStatus.APROBADO;
  if (curso.status.includes(CursoStatus.INSCRITO)) return CursoStatus.INSCRITO;
  if (curso.status.includes(CursoStatus.REPROBADO))
    return CursoStatus.REPROBADO;
  return CursoStatus.PENDIENTE;
}

/**
 * Obtiene la malla curricular de la carrera especificada.
 * @param carrera Carrera de la cual se desea obtener la malla.
 * @returns Lista de cursos de la malla.
 */
export async function getMalla(carrera: Carrera): Promise<Curso[]> {
  const cursosMalla = await fetchMalla(carrera.codigo, carrera.catalogo);
  const cursos: Curso[] = [];
  for (const cursoMalla of cursosMalla) {
    const curso: Curso = {
      ...cursoMalla,
      prerrequisitos: getPrerrequisitosAsCursos(cursoMalla.prereq, cursosMalla),
      nrc: "",
      periodo: "",
      status: [CursoStatus.PENDIENTE],
    };
    cursos.push(curso);
  }
  return cursos;
}

/**
 * Obtiene el avance del estudiante.
 * @param rut RUT del estudiante.
 * @param carrera Carrera del estudiante.
 * @returns Lista de cursos que representan el avance del estudiante.
 */
async function getAvance(rut: string, carrera: Carrera): Promise<Curso[]> {
  const cursosAvance = await fetchAvance(rut, carrera.codigo);
  const cursos: Curso[] = [];
  for (const cursoAvance of cursosAvance) {
    const curso: Curso = {
      ...cursoAvance,
      status: [cursoAvance.status as CursoStatus],
      codigo: cursoAvance.course,
      asignatura: "",
      creditos: 0,
      nivel: 0,
      prerrequisitos: [],
      periodo: cursoAvance.period,
    };
    cursos.push(curso);
  }
  return cursos;
}

/**
 * Obtiene la malla curricular del estudiante con el estado de avance en cada curso. Si un curso
 * aparece múltiples veces en el avance, se determina el estado final siguiendo el siguiente orden:
 * REPROBADO < INSCRITO < APROBADO.
 * @param rut RUT del estudiante.
 * @param carrera Carrera del estudiante.
 * @returns Lista de cursos de la malla con su estado de avance.
 */
export async function getAvanceCurricular(
  rut: string,
  carrera: Carrera
): Promise<Curso[]> {
  const [cursosMalla, cursosAvance] = await Promise.all([
    getMalla(carrera),
    getAvance(rut, carrera),
  ]);
  const cursos: Curso[] = [];
  for (const cursoMalla of cursosMalla) {
    const curso: Curso = {
      ...cursoMalla,
      status: [getFinalStatus(cursoMalla.codigo, cursosAvance)],
    };
    cursos.push(curso);
  }
  return cursos;
}

/**
 * Obtiene el avance del estudiante con los estados agrupados. Por ejemplo, si un curso aparece
 * múltiples veces en el avance, el estado del curso será una lista con todos los estados.
 * @param rut RUT del estudiante.
 * @param carrera Carrera del estudiante.
 * @returns Lista de cursos con los estados agrupados.
 */
export async function getAvanceAgrupado(
  rut: string,
  carrera: Carrera
): Promise<Curso[]> {
  const [cursosMalla, cursosAvance] = await Promise.all([
    getMalla(carrera),
    getAvance(rut, carrera),
  ]);
  const cursos: Curso[] = [];
  for (const cursoMalla of cursosMalla) {
    const estadosCurso = cursosAvance
      .filter((curso) => curso.codigo === cursoMalla.codigo)
      .map((curso) => curso.status[0]);
    const curso: Curso = {
      ...cursoMalla,
      status: estadosCurso.length > 0 ? estadosCurso : [CursoStatus.PENDIENTE],
    };
    cursos.push(curso);
  }
  return cursos;
}

/**
 * Obtiene todo el historial de cursos del estudiante en orden cronológico.
 * @param rut RUT del estudiante.
 * @param carrera Carrera del estudiante.
 * @returns Lista de cursos del avance cronológico del estudiante.
 */
export async function getAvanceCronologico(
  rut: string,
  carrera: Carrera
): Promise<Curso[]> {
  const [cursosMalla, cursosAvance] = await Promise.all([
    getMalla(carrera),
    getAvance(rut, carrera),
  ]);
  const cursos: Curso[] = [];
  for (const cursoAvance of cursosAvance) {
    const cursoMalla = cursosMalla.find(
      (curso) => curso.codigo === cursoAvance.codigo
    );
    const curso: Curso = {
      ...cursoAvance,
      asignatura: cursoMalla?.asignatura || cursoAvance.codigo,
      creditos: cursoMalla?.creditos || 0,
    };
    cursos.push(curso);
  }
  return cursos;
}

/**
 * Agrupa los cursos por nivel.
 *
 * @param cursos Lista de cursos a agrupar.
 * @returns Un objeto donde las claves son los niveles y los valores son listas de cursos.
 */
export function getCursosPorNivel(cursos: Curso[]): Record<string, Curso[]> {
  const cursosPorNivel: Record<string, Curso[]> = {};
  cursos.forEach((curso) => {
    if (!cursosPorNivel[curso.nivel]) {
      cursosPorNivel[curso.nivel] = [];
    }
    cursosPorNivel[curso.nivel].push(curso);
  });
  return cursosPorNivel;
}

/**
 * Agrupa los cursos por periodo.
 *
 * @param cursos Lista de cursos a agrupar.
 * @returns Un objeto donde las claves son los periodos y los valores son listas de cursos.
 */
export function getCursosPorPeriodo(cursos: Curso[]): Record<string, Curso[]> {
  const cursosPorPeriodo: Record<string, Curso[]> = {};
  cursos.forEach((curso) => {
    if (!cursosPorPeriodo[curso.periodo]) {
      cursosPorPeriodo[curso.periodo] = [];
    }
    cursosPorPeriodo[curso.periodo].push(curso);
  });
  return cursosPorPeriodo;
}

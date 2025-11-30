import { LIMITE_CREDITOS } from "../constants/proyeccionConstants";
import { Curso, CursoStatus } from "../types/curso";
import {
  getCursosBloqueantes,
  getNivelEstudiante,
  isDisperso,
} from "./proyeccionUtils";
import { getSemestreActual, getSemestreSiguiente } from "./semestreUtils";

const PESOS = {
  ATRASADO: 10,
  REPROBADO: 100,
  POTENCIAL_DESBLOQUEO: 5,
};

/**
 * Calcula el potencial de desbloqueo de cada curso en base a cuántos cursos dependen de él.
 * Ejemplo: Cursos como "Programación" tendrán un potencial de desbloqueo alto porque muchos
 * cursos dependen de él como prerrequisito.
 * @param cursos Los cursos a evaluar.
 * @returns Map<string, number> Mapa de código de curso a su potencial de desbloqueo.
 */
function calcularPotencialDesbloqueo(cursos: Curso[]): Map<string, number> {
  const potencialDesbloqueo = new Map<string, number>();
  cursos.forEach((curso) => {
    potencialDesbloqueo.set(curso.codigo, 0);
  });

  cursos.forEach((curso) => {
    curso.prerrequisitos.forEach((prereq) => {
      potencialDesbloqueo.set(
        prereq.codigo,
        potencialDesbloqueo.get(prereq.codigo)! + 1
      );
    });
  });
  return potencialDesbloqueo;
}

/**
 * Genera una proyección óptima de cursos a inscribir en semestres futuros. La prioridad de
 * cursos a elegir se basa en:
 * 1. Cursos atrasados (nivel menor al nivel del estudiante)
 * 2. Cursos reprobados
 * 3. Cursos con mayor potencial de desbloqueo
 * @param cursos Los cursos disponibles para la proyección.
 * @returns Record<string, Curso[]> Un objeto donde las claves son los semestres y los valores
 * son los cursos proyectados para ese semestre.
 */
export function generarProyeccionOptima(
  cursos: Curso[]
): Record<string, Curso[]> {
  const potencialDesbloqueo = calcularPotencialDesbloqueo(cursos);
  const proyeccionesGeneradas: Record<string, Curso[]> = {};
  let semestreActual = getSemestreSiguiente(getSemestreActual());

  while (cursos.some((curso) => !curso.status.includes(CursoStatus.APROBADO))) {
    const nivelEstudiante = getNivelEstudiante(cursos);

    const candidatos = cursos.filter((c) => {
      const noAprobado = !c.status.includes(CursoStatus.APROBADO);
      const cumplePrerequisitos = getCursosBloqueantes(c, cursos).length === 0;
      const cumpleDispersion = !isDisperso(c, nivelEstudiante);
      return noAprobado && cumplePrerequisitos && cumpleDispersion;
    });

    candidatos.sort((a, b) => {
      const scoreA =
        (nivelEstudiante - a.nivel) * PESOS.ATRASADO +
        (a.status.includes(CursoStatus.REPROBADO) ? PESOS.REPROBADO : 0) +
        (potencialDesbloqueo.get(a.codigo) || 0) * PESOS.POTENCIAL_DESBLOQUEO;

      const scoreB =
        (nivelEstudiante - b.nivel) * PESOS.ATRASADO +
        (b.status.includes(CursoStatus.REPROBADO) ? PESOS.REPROBADO : 0) +
        (potencialDesbloqueo.get(b.codigo) || 0) * PESOS.POTENCIAL_DESBLOQUEO;

      return scoreB - scoreA;
    });

    const proyeccionSemestre: Curso[] = [];
    let creditosAcumulados = 0;
    for (const curso of candidatos) {
      if (creditosAcumulados + curso.creditos <= LIMITE_CREDITOS) {
        proyeccionSemestre.push(curso);
        creditosAcumulados += curso.creditos;
      }
    }

    if (proyeccionSemestre.length === 0) break;
    proyeccionesGeneradas[semestreActual] = proyeccionSemestre;
    proyeccionSemestre.forEach((cursoInscrito) => {
      const cursoEnSimulacion = cursos.find(
        (c) => c.codigo === cursoInscrito.codigo
      )!;
      cursoEnSimulacion.status = [CursoStatus.APROBADO];
    });

    semestreActual = getSemestreSiguiente(semestreActual);
  }

  return proyeccionesGeneradas;
}

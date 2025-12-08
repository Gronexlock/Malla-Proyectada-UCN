import { Proyeccion } from "../types/proyeccion";

/**
 * Calcula el semestre de egreso más temprano entre un conjunto de proyecciones.
 * @param proyecciones Array de proyecciones a evaluar.
 * @returns El semestre de egreso más temprano encontrado.
 */
export function getEgresoMasTemprano(proyecciones: Proyeccion[]): string {
  return proyecciones.reduce((earlist, proyeccion) => {
    const cantSemestres = proyeccion.semestres.length;
    return earlist < proyeccion.semestres[cantSemestres - 1].semestre
      ? earlist
      : proyeccion.semestres[cantSemestres - 1].semestre;
  }, "9999-9");
}

/**
 * Calcula la cantidad total de cursos pendientes en un conjunto de proyecciones.
 * Debería ser igual para todas las proyecciones.
 * @param proyecciones Array de proyecciones a evaluar.
 * @returns La cantidad total de cursos pendientes.
 */
export function getCantidadCursosPendientes(
  proyecciones: Proyeccion[]
): number {
  if (proyecciones.length === 0) {
    return 0;
  }
  return proyecciones[0].semestres.reduce(
    (acc, semestre) => acc + semestre.cursos.length,
    0
  );
}

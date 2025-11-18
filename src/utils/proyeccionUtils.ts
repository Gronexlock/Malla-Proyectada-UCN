import { Curso } from "../types/curso";

/**
 * Actualiza el avance del estudiante, cambiando todos los cursos con estado
 * "INSCRITO" a estado "APROBADO".
 * @param setAvance Función para actualizar el estado del avance.
 */
export function actualizarAvance(
  setAvance: React.Dispatch<React.SetStateAction<Curso[]>>
) {
  setAvance((prev) =>
    prev.map((curso) =>
      curso.status === "INSCRITO" ? { ...curso, status: "APROBADO" } : curso
    )
  );
}

/**
 * Agrega un curso con el código dado al avance del estudiante, cambiando
 * su estado a "INSCRITO".
 * @param codigo Código del curso que se agregará al avance.
 * @param cursos Lista de cursos del avance del estudiante.
 * @param setAvance Función para actualizar el estado del avance.
 */
export function agregarCursoAlAvance(
  codigo: string,
  cursos: Curso[],
  setAvance: React.Dispatch<React.SetStateAction<Curso[]>>
) {
  const curso = cursos.find(
    (c) =>
      c.codigo === codigo &&
      (c.status === "PENDIENTE" || c.status === "REPROBADO")
  );
  if (curso) {
    setAvance((prev) => [...prev, { ...curso, status: "INSCRITO" }]);
  }
}
/**
 * Elimina un curso con el código dado del avance del estudiante, cambiando
 * su estado a "PENDIENTE".
 * @param codigo Código del curso que se eliminará del avance.
 * @param cursos Lista de cursos del avance del estudiante.
 * @param setAvance Función para actualizar el estado del avance.
 */
export function eliminarInscripcion(
  codigo: string,
  cursos: Curso[],
  setAvance: React.Dispatch<React.SetStateAction<Curso[]>>
) {
  const curso = cursos.find(
    (c) => c.codigo === codigo && c.status === "INSCRITO"
  );
  if (curso) {
    setAvance((prev) => prev.filter((c) => c.codigo !== codigo));
  }
}

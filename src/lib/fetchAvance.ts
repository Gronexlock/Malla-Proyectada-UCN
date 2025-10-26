import { CursoAvance } from "../types/curso";

export async function fetchAvance(rut: string, codCarrera: string) {
  const url = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${rut}&codcarrera=${codCarrera}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    const data = await response.json();

    return data as CursoAvance[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

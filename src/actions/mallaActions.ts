import { MallaSchema } from "../schemas/mallaSchema";
import { getCursosMallaAsCursos } from "../utils/cursosUtils";

export async function fetchMalla(codigo: string, catalogo: string) {
  try {
    if (!codigo || !catalogo) {
      throw new Error("Los parámetros 'codigo' y 'catalogo' son obligatorios");
    }

    const authHeader = process.env.HAWAII_AUTH_HEADER;
    if (!authHeader) {
      throw new Error(
        "La variable de entorno 'HAWAII_AUTH_HEADER' no está configurada"
      );
    }

    const url = `https://losvilos.ucn.cl/hawaii/api/mallas?${codigo}-${catalogo}`;

    const response = await fetch(url, {
      headers: {
        "X-HAWAII-AUTH": authHeader,
      },
    });
    if (response.status === 401) {
      console.error(response.statusText);
      throw new Error(
        "Autenticación fallida. Verifica el header de autenticación."
      );
    }
    if (!response.ok) {
      console.error(response.statusText);
      throw new Error("Error al obtener los datos");
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("La respuesta de la API no es un arreglo válido");
    }
    if (data.length === 0) {
      throw new Error("No se encontraron cursos en la malla solicitada");
    }

    const parsedData = MallaSchema.safeParse(data);
    if (!parsedData.success) {
      console.error(parsedData.error);
      throw new Error("Los datos recibidos no cumplen con el esquema esperado");
    }

    const cursos = getCursosMallaAsCursos(parsedData.data);

    return cursos;
  } catch (error) {
    console.error("Error al obtener la malla curricular:", error);
    return [];
  }
}

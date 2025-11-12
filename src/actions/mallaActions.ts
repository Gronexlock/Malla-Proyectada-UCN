import z from "zod";

const CursoMallaSchema = z.object({
  codigo: z.string(),
  asignatura: z.string(),
  creditos: z.number().min(1).max(30),
  nivel: z.number().min(1).max(10),
  prereq: z.string(),
});

const MallaSchema = z.array(CursoMallaSchema);

export async function fetchMalla(codigo: string, catalogo: string) {
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

  try {
    const response = await fetch(url, {
      headers: {
        "X-HAWAII-AUTH": authHeader,
      },
    });
    if (response.status === 401) {
      throw new Error(
        "Autenticación fallida. Verifica el header de autenticación."
      );
    }
    if (!response.ok) {
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
      throw new Error(
        "Los datos recibidos no cumplen con el esquema esperado: " +
          parsedData.error.message
      );
    }

    return parsedData.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

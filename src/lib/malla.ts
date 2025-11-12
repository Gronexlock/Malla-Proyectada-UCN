import { CursoMalla } from "@/src/types/curso";
import { formatPrereq } from "../utils/curso";

export async function fetchMalla(codigo: string, catalogo: string) {
  const url = `https://losvilos.ucn.cl/hawaii/api/mallas?${codigo}-${catalogo}`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-HAWAII-AUTH": process.env.HAWAII_AUTH_KEY ?? "",
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    const data = await response.json();
    data.forEach((curso: any) => {
      curso.prereq = formatPrereq(curso.prereq, data);
    });

    return data as CursoMalla[];
  } catch (error) {
    console.error(error);
    return [];
  }
}
export { formatPrereq };

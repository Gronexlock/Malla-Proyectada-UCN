import { CursoMalla } from "@/src/types/curso";

export function formatPrereq(
  prereq: string,
  cursos: CursoMalla[]
): { codigo: string; asignatura: string }[] {
  const prereqList = prereq
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p !== "");
  const formatted = prereqList.map((p) => {
    const curso = cursos.find((c) => c.codigo === p);
    return {
      codigo: p,
      asignatura: curso ? curso.asignatura : p,
    };
  });
  return formatted;
}

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
      console.log(curso.prereq);
    });

    return data as CursoMalla[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

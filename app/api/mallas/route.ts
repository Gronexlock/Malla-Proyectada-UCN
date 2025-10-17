import { CursoMalla } from "@/src/types/curso";
import { NextResponse } from "next/server";

function formatPrereq(prereq: string, cursos: CursoMalla[]) {
  const prereqList = prereq
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p !== "");
  const formatted = prereqList.map((p) => {
    const curso = cursos.find((c) => c.codigo === p);
    return curso ? `${curso.asignatura}` : p;
  });
  return formatted;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const codigo = searchParams.get("codigo");
  if (!codigo) {
    return NextResponse.json(
      { error: "Faltan parámetros obligatorios" },
      { status: 400 }
    );
  }

  const url = `https://losvilos.ucn.cl/hawaii/api/mallas?${codigo}`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-HAWAII-AUTH": process.env.HAWAII_AUTH_KEY ?? "",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al obtener los datos" },
        { status: 500 }
      );
    }
    const data = await response.json();
    data.forEach((curso: any) => {
      curso.prereq = formatPrereq(curso.prereq, data);
      console.log(curso.prereq);
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al realizar la solicitud" },
      { status: 500 }
    );
  }
}

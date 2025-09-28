import { NextResponse } from "next/server";

export async function GET() {
  const [avanceResponse, mallaResponse] = await Promise.all([
    fetch(
      "https://puclaro.ucn.cl/eross/avance/avance.php?rut=222222222&codcarrera=8266"
    ),
    fetch("https://losvilos.ucn.cl/hawaii/api/mallas?8266-202410", {
      headers: {
        "X-HAWAII-AUTH": process.env.HAWAII_AUTH_KEY ?? "",
      },
    }),
  ]);
  const [avanceData, mallaData] = await Promise.all([
    avanceResponse.json(),
    mallaResponse.json(),
  ]);

  const aprobados = avanceData.filter(
    (curso: any) => curso.status === "APROBADO"
  );

  const conNombre: any[] = [];
  const sinNombre: any[] = [];

  aprobados.forEach((curso: any) => {
    const course = mallaData.find((c: any) => c.codigo === curso.course);
    if (course) {
      conNombre.push({ ...curso, nombre: course.asignatura });
    } else {
      sinNombre.push(curso);
    }
  });

  return NextResponse.json({
    mallaData,
    avanceData,
    aprobados,
    conNombre,
    sinNombre,
  });
}

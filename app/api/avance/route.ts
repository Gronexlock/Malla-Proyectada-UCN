import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rut = searchParams.get("rut");
  const codCarrera = searchParams.get("codCarrera");

  if (!rut || !codCarrera) {
    return NextResponse.json(
      { error: "Faltan parámetros obligatorios" },
      { status: 400 }
    );
  }

  const url = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${encodeURIComponent(
    rut
  )}&codcarrera=${encodeURIComponent(codCarrera)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Error al obtener el avance" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al realizar la solicitud" },
      { status: 500 }
    );
  }
}

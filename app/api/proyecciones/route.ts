import prisma from "@/src/lib/prisma";
import { CursoMalla } from "@/src/types/curso";
import { NextResponse } from "next/server";

// TODO: implementar autenticación

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const estudianteRut = searchParams.get("rut");
    const carreraCodigo = searchParams.get("carrera");

    if (!estudianteRut || !carreraCodigo) {
      return NextResponse.json(
        { error: "Faltan parámetros obligatorios" },
        { status: 400 }
      );
    }

    const proyecciones = await prisma.proyeccion.findMany({
      where: {
        estudianteRut,
        carreraCodigo,
      },
      include: {
        cursos: true,
      },
    });

    if (proyecciones.length === 0) {
      return NextResponse.json(
        { error: "No se encontraron proyecciones" },
        { status: 404 }
      );
    }

    return NextResponse.json(proyecciones);
  } catch (error) {
    console.error("Error al obtener las proyecciones:", error);
    return NextResponse.json(
      { error: "Error al obtener las proyecciones" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      estudianteRut,
      carreraCodigo,
      proyecciones,
    }: {
      estudianteRut: string;
      carreraCodigo: string;
      proyecciones: Record<string, CursoMalla[]>;
    } = await req.json();

    const nuevaProyeccion = await prisma.proyeccion.create({
      data: {
        estudianteRut,
        carreraCodigo,
        cursos: {
          create: Object.entries(proyecciones).flatMap(([semestre, cursos]) =>
            cursos.map((curso) => ({
              cursoCodigo: curso.codigo,
              semestre,
            }))
          ),
        },
      },
    });

    return NextResponse.json(nuevaProyeccion);
  } catch (error) {
    console.error("Error al crear la proyección:", error);
    return NextResponse.json(
      { error: "Error al crear la proyección" },
      { status: 500 }
    );
  }
}

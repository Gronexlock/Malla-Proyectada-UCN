import prisma from "@/src/lib/prisma";
import { CursoMalla } from "@/src/types/curso";
import { NextResponse } from "next/server";

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

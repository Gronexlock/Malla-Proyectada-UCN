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

    const nuevaProyeccion = await prisma.proyeccionTotal.create({
      data: {
        estudianteRut,
        carreraCodigo,
        proyeccionesSemestres: {
          create: Object.entries(proyecciones).map(([semestre, cursos]) => ({
            semestre,
            cursos: {
              connect: cursos.map((curso: { codigo: string }) => ({
                codigo: curso.codigo,
              })),
            },
          })),
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

import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const idSchema = z
    .string()
    .trim()
    .regex(/^\d+$/, "El ID debe ser un número válido")
    .transform((val) => parseInt(val, 10))
    .refine((num) => num > 0, "El ID debe ser un número positivo");
    ;


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {

    const parsed = idSchema.safeParse(params.id);
    if (!parsed.success) {
      const firstError = parsed.error.issues?.[0]?.message || "ID inválido";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    const proyeccionId = parsed.data;


    const proyeccion = await prisma.proyeccion.findUnique({
      where: {
        id: proyeccionId,
      },
      include: {
        cursos: true,
      },
    });

    if (!proyeccion) {
      return NextResponse.json(
        { error: "Proyección no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(proyeccion, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener la proyección" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const parsed = idSchema.safeParse(params.id);
    if (!parsed.success) {
      const firstError = parsed.error.issues?.[0]?.message || "ID inválido";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const proyeccionId = parsed.data;

    const proyeccion = await prisma.proyeccion.delete({
      where: {
        id: proyeccionId,
      },
    });

    if (!proyeccion) {
      return NextResponse.json(
        { error: "Proyección no encontrada" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Proyección eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar la proyección" },
      { status: 500 }
    );
  }
}

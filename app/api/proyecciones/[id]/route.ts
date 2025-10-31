import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const proyeccionId = parseInt(id, 10);

    if (isNaN(proyeccionId) || proyeccionId <= 0) {
      return NextResponse.json(
        { error: "ID de proyección inválido" },
        { status: 400 }
      );
    }

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

import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/apiAuth"; // 🔐 Importar helper de autenticación

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 🔒 Verificar autenticación antes de continuar
  const session = await requireAuth(req);
  if ("error" in session) return session;

  try {
    const { id } = params;
    const proyeccionId = parseInt(id, 10);

    if (isNaN(proyeccionId) || proyeccionId <= 0) {
      return NextResponse.json(
        { error: "ID de proyección inválido" },
        { status: 400 }
      );
    }

    const proyeccion = await prisma.proyeccion.findUnique({
      where: { id: proyeccionId },
      include: { cursos: true },
    });

    if (!proyeccion) {
      return NextResponse.json(
        { error: "Proyección no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(proyeccion, { status: 200 });
  } catch (error) {
    console.error("Error al obtener la proyección:", error);
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
  // 🔒 Verificar autenticación antes de eliminar
  const session = await requireAuth(req);
  if ("error" in session) return session;

  try {
    const { id } = params;
    const proyeccionId = parseInt(id, 10);

    if (isNaN(proyeccionId) || proyeccionId <= 0) {
      return NextResponse.json(
        { error: "ID de proyección inválido" },
        { status: 400 }
      );
    }

    const proyeccion = await prisma.proyeccion.delete({
      where: { id: proyeccionId },
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
    console.error("Error al eliminar la proyección:", error);
    return NextResponse.json(
      { error: "Error al eliminar la proyección" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/apiAuth"; // importamos el validador JWT

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  //  Verificar autenticación
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 403 }
    );
  }

  try {
    const id = parseInt(params.id);

    // Lógica normal: eliminar proyección
    await prisma.proyeccion.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Proyección eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting proyeccion:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

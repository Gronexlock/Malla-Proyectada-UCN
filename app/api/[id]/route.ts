import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.proyeccion.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Proyección eliminada exitosamente' 
    });
  } catch (error) {
    console.error('Error deleting proyeccion:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
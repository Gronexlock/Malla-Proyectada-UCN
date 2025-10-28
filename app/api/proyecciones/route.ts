import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const proyecciones = await prisma.proyeccion.findMany({
      include: {
        semestres: {
          include: {
            cursos: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: proyecciones,
      count: proyecciones.length 
    });
  } catch (error) {
    console.error('Error fetching proyecciones:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { estudianteRut, carreraCodigo, semestres } = body;

    if (!estudianteRut || !carreraCodigo) {
      return NextResponse.json(
        { success: false, error: 'Estudiante RUT y código de carrera son requeridos' },
        { status: 400 }
      );
    }

    const proyeccion = await prisma.proyeccion.create({
      data: {
        estudianteRut,
        carreraCodigo,
        semestres: {
          create: semestres.map((semestre: any) => ({
            semestre: semestre.semestre,
            cursos: {
              connect: semestre.cursos.map((codigo: string) => ({ codigo }))
            }
          }))
        }
      },
      include: {
        semestres: {
          include: {
            cursos: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: proyeccion,
      message: 'Proyección creada exitosamente' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating proyeccion:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
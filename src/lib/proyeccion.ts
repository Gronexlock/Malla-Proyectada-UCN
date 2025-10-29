import { CursoMalla } from "../types/curso";
import prisma from "./prisma";

export async function fetchProyecciones(estudianteRut: string) {
  try {
    const proyecciones = await prisma.proyeccionTotal.findMany({
      where: { estudianteRut },
      include: {
        proyeccionesSemestres: {
          include: {
            cursos: true,
          },
        },
      },
    });

    return proyecciones;
  } catch (error) {
    console.error("Error obteniendo proyecciones:", error);
    return [];
  }
}

export async function crearProyeccion(
  estudianteRut: string,
  carreraCodigo: string,
  proyecciones: Record<string, CursoMalla[]>
) {
  await prisma.proyeccionTotal.create({
    data: {
      estudianteRut,
      carreraCodigo,
      proyeccionesSemestres: {
        create: Object.entries(proyecciones).map(([semestre, cursos]) => ({
          semestre,
          cursos: {
            connect: cursos.map((curso) => ({ codigo: curso.codigo })),
          },
        })),
      },
    },
  });
}

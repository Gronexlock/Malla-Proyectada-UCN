import prisma from "@/src/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "./authActions";

export async function getProyecciones(
  rut: string,
  codigoCarrera: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    if (!rut || !codigoCarrera) {
      throw new Error(
        "Los parámetros 'rut' y 'codigoCarrera' son obligatorios"
      );
    }

    const token = (await cookies()).get("token")?.value;
    const payload = await verifyToken(token);

    if (payload.rut !== rut) {
      throw new Error("No autorizado para acceder a este recurso");
    }

    const offset = (page - 1) * limit;
    const proyecciones = await prisma.proyeccion.findMany({
      where: {
        estudianteRut: rut,
        carreraCodigo: codigoCarrera,
      },
      include: {
        cursos: true,
      },
      skip: offset,
      take: limit,
    });

    return proyecciones;
  } catch (error) {
    console.error("Error al obtener las proyecciones:", error);
    return [];
  }
}

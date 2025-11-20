"use server";

import prisma from "@/src/lib/prisma";
import { cookies } from "next/headers";
import { ProyeccionSchema } from "../schemas/proyeccionSchema";
import { Curso } from "../types/curso";
import { verifyToken } from "./authActions";
import { getUser } from "./cookiesActions";

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

export async function guardarProyeccion(proyeccion: Record<string, Curso[]>) {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Usuario no autenticado");
    }
    const { rut, selectedCarrera } = user;

    if (!proyeccion || Object.keys(proyeccion).length === 0) {
      throw new Error("La proyección no puede estar vacía");
    }

    const proyeccionFormatted = Object.entries(proyeccion).map(
      ([semestre, cursos]) => ({
        semestre,
        cursos: cursos.map((curso) => ({ codigo: curso.codigo })),
      })
    );

    const parsedData = ProyeccionSchema.safeParse(proyeccionFormatted);
    if (!parsedData.success) {
      console.error(parsedData.error);
      throw new Error(
        "Los datos de proyección no cumplen con el esquema esperado"
      );
    }

    const cursosParaConectar = Object.entries(proyeccion).flatMap(
      ([semestre, cursosDelSemestre]) =>
        cursosDelSemestre.map((curso) => ({
          semestre: semestre,
          cursoCodigo: curso.codigo,
        }))
    );

    const nuevaProyeccion = await prisma.proyeccion.create({
      data: {
        estudianteRut: rut,
        carreraCodigo: selectedCarrera.codigo,
        cursos: {
          create: cursosParaConectar,
        },
      },
      include: {
        cursos: true,
      },
    });

    return { success: true, data: nuevaProyeccion };
  } catch (error) {
    console.error("Error al guardar la proyección:", error);
    throw new Error("Error al guardar la proyección");
  }
}

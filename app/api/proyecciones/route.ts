import prisma from "@/src/lib/prisma";
import { CursoMalla } from "@/src/types/curso";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ca } from "zod/v4/locales";

// TODO: implementar autenticación

const getQuerySchema = z.object({
  rut: z.string().trim().min(1, "El RUT es obligatorio"),
  carrera: z.string().trim().min(1, "El código de carrera es obligatorio"),
});

const cursoSchema = z.object({
  codigo: z.string().trim().min(1, "El código del curso es obligatorio"),
});

const postBodySchema = z.object({
  estudianteRut: z.string().trim().min(1, "El RUT es obligatorio"),
  carreraCodigo: z.string().trim().min(1, "El código de carrera es obligatorio"),
  proyecciones: z.record(z.string(),z.array(cursoSchema)).refine((obj) => Object.keys(obj).length > 0, {
    message: "Debe haber al menos una proyección",
  }),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const estudianteRut = searchParams.get("rut") ?? "";
    const carreraCodigo = searchParams.get("carrera") ?? "";

    const parsed = getQuerySchema.safeParse({rut: estudianteRut, carrera: carreraCodigo});
    if (!parsed.success) {
      const firstError = parsed.error.issues?.[0]?.message || "Datos inválidos";
      return NextResponse.json({ error: firstError }, { status: 400 }
      );
    }

    const { rut, carrera } = parsed.data;


    const proyecciones = await prisma.proyeccion.findMany({
      where: {
        estudianteRut: rut,
        carreraCodigo: carrera,
      },
      include: {
        cursos: true,
      },
    });

    if (proyecciones.length === 0) {
      return NextResponse.json(
        { error: "No se encontraron proyecciones" },
        { status: 404 }
      );
    }

    return NextResponse.json(proyecciones);
  } catch (error) {
    console.error("Error al obtener las proyecciones:", error);
    return NextResponse.json(
      { error: "Error al obtener las proyecciones" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {

    const body = await req.json();
    const parsed = postBodySchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues?.[0]?.message || "Datos inválidos";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    
    const { estudianteRut, carreraCodigo, proyecciones } = parsed.data;


    const nuevaProyeccion = await prisma.proyeccion.create({
      data: {
        estudianteRut,
        carreraCodigo,
        cursos: {
          create: Object.entries(proyecciones).flatMap(([semestre, cursos]) =>
            cursos.map((curso) => ({
              cursoCodigo: curso.codigo,
              semestre,
            }))
          ),
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

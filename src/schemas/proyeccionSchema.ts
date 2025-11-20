import z from "zod";

const CursoProyeccionSchema = z.object({
  codigo: z.string(),
});

const semestreSchema = z.object({
  semestre: z.string(),
  cursos: z.array(CursoProyeccionSchema).min(1),
});

export const ProyeccionSchema = z.array(semestreSchema).min(1);

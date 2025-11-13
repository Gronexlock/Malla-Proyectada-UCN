import z from "zod";

export const CursoMallaSchema = z.object({
  codigo: z.string(),
  asignatura: z.string(),
  creditos: z.number().min(1).max(30),
  nivel: z.number().min(1).max(10),
  prereq: z.string(),
});

export const MallaSchema = z.array(CursoMallaSchema);

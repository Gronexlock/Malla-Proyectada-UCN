import z from "zod";

export const CursoAvanceSchema = z.object({
  nrc: z.string(),
  period: z.string(),
  student: z.string(),
  course: z.string(),
  excluded: z.boolean(),
  inscriptionType: z.string(),
  status: z.enum(["APROBADO", "REPROBADO", "INSCRITO", "PENDIENTE"]),
});

export const AvanceSchema = z.array(CursoAvanceSchema);

export type CursoAvance = z.infer<typeof CursoAvanceSchema>;

export type Avance = z.infer<typeof AvanceSchema>;

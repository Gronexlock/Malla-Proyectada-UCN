import z from "zod";
import { CursoMallaSchema } from "@/src/schemas/malla";
import { CursoAvanceSchema } from "../schemas/avance";

export type CursoMalla = z.infer<typeof CursoMallaSchema>;
export type CursoAvance = z.infer<typeof CursoAvanceSchema>;

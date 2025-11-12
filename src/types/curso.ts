import z from "zod";
import { CursoMallaSchema } from "@/src/schemas/malla";

export type CursoMalla = z.infer<typeof CursoMallaSchema>;

export interface CursoAvance {
  nrc?: string;
  period?: string;
  student?: string;
  course: string;
  excluded?: boolean;
  inscriptionType?: string;
  status: "APROBADO" | "REPROBADO" | "INSCRITO" | "PENDIENTE";
}

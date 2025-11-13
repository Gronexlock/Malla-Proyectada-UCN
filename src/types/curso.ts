import z from "zod";
import { CursoMallaSchema } from "@/src/schemas/malla";
import { CourseProgressSchema } from "../schemas/progressSchema";

export type CursoMalla = z.infer<typeof CursoMallaSchema>;
export type CursoAvance = z.infer<typeof CourseProgressSchema>;

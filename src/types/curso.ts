import z from "zod";
import { CursoMallaSchema } from "@/src/schemas/mallaSchema";
import { CourseProgressSchema } from "../schemas/avanceSchema";

export type CursoMalla = z.infer<typeof CursoMallaSchema>;
export type CursoAvance = z.infer<typeof CourseProgressSchema>;

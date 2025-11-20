import z from "zod";

export const CarreraSchema = z.object({
  codigo: z.string(),
  nombre: z.string(),
  catalogo: z.string(),
});

export const UserSchema = z.object({
  rut: z.string().min(8).max(9),
  carreras: z.array(CarreraSchema).min(1),
});

export type User = z.infer<typeof UserSchema> & {
  selectedCarrera: z.infer<typeof CarreraSchema>;
};

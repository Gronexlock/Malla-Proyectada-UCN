import z from "zod";

export const UserSchema = z.object({
  rut: z.string().min(8).max(9),
  carreras: z.array(
    z.object({
      codigo: z.string(),
      nombre: z.string(),
      catalogo: z.string(),
    })
  ),
});

export type User = z.infer<typeof UserSchema>;

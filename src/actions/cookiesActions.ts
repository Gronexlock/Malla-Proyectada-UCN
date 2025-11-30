"use server";

import { cookies } from "next/headers";
import { User, UserSchema } from "../schemas/userSchema";

export async function setUser(user: User) {
  const parsedUser = UserSchema.safeParse(user);
  if (!parsedUser.success) {
    console.error(parsedUser.error);
    throw new Error("El usuario no cumple con el esquema esperado");
  }

  const cookieStore = await cookies();

  cookieStore.set("user", JSON.stringify(user), {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });
}

export async function getUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;

  if (!userCookie) {
    throw new Error("No se encontró la cookie de usuario");
  }

  return JSON.parse(userCookie) as User;
}

export async function setSelectedCarrera(codigo: string) {
  try {
    const user = await getUser();
    const carrera = user.carreras.find((c) => c.codigo === codigo);

    if (!carrera) {
      return { success: false, error: "Carrera no encontrada" };
    }

    user.selectedCarrera = carrera;
    await setUser(user);

    return { success: true, carrera };
  } catch (e: any) {
    console.error("Error al seleccionar carrera:", e);
    return {
      success: false,
      error: e.message || "Error desconocido al seleccionar carrera",
    };
  }
}

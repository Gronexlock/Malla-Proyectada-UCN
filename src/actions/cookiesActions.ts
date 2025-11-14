"use server";

import { cookies } from "next/headers";
import { User } from "../schemas/userSchema";

export async function setUser(user: User) {
  const cookieStore = await cookies();

  cookieStore.set("user", JSON.stringify(user), {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
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
  const user = await getUser();
  const carrera = user.carreras.find((c) => c.codigo === codigo);

  if (!carrera) {
    throw new Error("Carrera no encontrada");
  }

  user.selectedCarrera = carrera;
  await setUser(user);
}

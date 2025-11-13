"use server";

import { cookies } from "next/headers";
import { User } from "../schemas/userSchema";

export async function setSelectedCarrera(codigo: string, catalogo: string) {
  const cookieStore = await cookies();

  cookieStore.set("selectedCarrera", JSON.stringify({ codigo, catalogo }), {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
}

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

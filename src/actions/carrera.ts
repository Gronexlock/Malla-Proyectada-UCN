"use server";

import { cookies } from "next/headers";

export async function setSelectedCarrera(
  codigo: string,
  catalogo: string,
  rut: string
) {
  const cookieStore = await cookies();

  cookieStore.set("selectedCarrera", JSON.stringify({ codigo, catalogo }), {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  cookieStore.set("rut", JSON.stringify({ rut }), {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
}

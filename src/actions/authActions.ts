"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import { UserSchema, User } from "../schemas/userSchema";
import { setUser } from "./cookiesActions";

export async function login(email: string, password: string) {
  const url = `https://puclaro.ucn.cl/eross/avance/login.php?email=${email}&password=${password}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error("Error en la solicitud de login");
  }

  const data = await response.json();
  if (data.error) {
    throw new Error("Credenciales inválidas");
  }

  const parsedData = UserSchema.safeParse(data);
  if (!parsedData.success) {
    console.error(parsedData.error);
    throw new Error("Los datos recibidos no cumplen con el esquema esperado");
  }

  const token = await new jose.SignJWT({ rut: data.rut })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  });

  await setUser(parsedData.data as User);

  return { success: true, user: data };
}

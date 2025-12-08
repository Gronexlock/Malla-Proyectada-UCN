"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import { User, UserSchema } from "../schemas/userSchema";
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
    return { success: false, message: "Credenciales inválidas" };
  }

  const parsedData = UserSchema.safeParse(data);
  if (!parsedData.success) {
    console.error(parsedData.error);
    throw new Error("Los datos recibidos no cumplen con el esquema esperado");
  }

  const token = await new jose.SignJWT({ user: parsedData.data })
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

  const user = parsedData.data as User;
  user.selectedCarrera = user.carreras[0];

  await setUser(user);

  return { success: true, user };
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  cookieStore.set("user", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  cookieStore.set("tutorial-seen", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
}

export async function verifyToken(token: string | undefined) {
  if (!token) {
    throw new Error("No autenticado");
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload.user as User;
  } catch {
    throw new Error("Token inválido");
  }
}

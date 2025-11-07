import { NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Validar credenciales en tu sistema externo
  const res = await fetch(
    `https://puclaro.ucn.cl/eross/avance/login.php?email=${encodeURIComponent(
      email
    )}&password=${encodeURIComponent(password)}`
  );
  const data = await res.json();

  if (data.error) {
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  // Guarda el RUT del usuario autenticado
  const token = await new jose.SignJWT({
    email,
    rut: data.rut, // Asegúrate de que el API te devuelva este campo
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  // Enviar cookie segura con el token
  const response = NextResponse.json({ success: true, user: data });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 día
    path: "/",
  });

  return response;
}

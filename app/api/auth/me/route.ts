import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Retorna la información del usuario autenticado (según el token JWT)
 */
export async function GET() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Retornamos el contenido del JWT (por ejemplo: email, rut, etc.)
    return NextResponse.json({ user: payload });
  } catch (err) {
    console.error("Error al verificar token:", err);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

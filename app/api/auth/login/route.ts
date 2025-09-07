import { NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(req: Request) {
  const { email, password } = await req.json();

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

  const token = await new jose.SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const response = NextResponse.json(new URL("/", req.url));
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  });

  return response;
}

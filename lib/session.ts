import * as jose from "jose";
import { cookies } from "next/headers";

export async function getUserSession(req?: Request) {
  // Si se llama desde handler server-side de Next, preferimos next/headers
  const cookieHeader = typeof req === "undefined" ? (await cookies()).get("token")?.value : req.headers.get("cookie");
  const raw = typeof cookieHeader === "string"
    ? cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("token="))?.split("=")[1]
    : (cookieHeader as any)?.value; // compatibilidad con cookies()

  const token = raw;
  if (!token) return null;

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET missing");
    return null;
  }

  try {
    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return { email: payload.email as string, rut: payload.rut as string };
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
}

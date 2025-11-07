import * as jose from "jose";

export async function getUserSession(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return {
      email: payload.email as string,
      rut: payload.rut as string, // 👈 agregado
    };
  } catch {
    return null;
  }
}

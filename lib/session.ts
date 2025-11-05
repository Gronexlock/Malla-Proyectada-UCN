import * as jose from "jose";

export async function getUserSession(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

  if (!token) return null;

  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return payload; // por ejemplo { email: "...", rut: "...", rol: "..."}
  } catch (err) {
    console.error("Token inválido:", err);
    return null;
  }
}

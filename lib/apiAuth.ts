import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/session";

export async function requireAuth(req: Request) {
  const session = await getUserSession(req);

  if (!session) {
    return NextResponse.json(
      { error: "No autorizado: sesión inválida o expirada" },
      { status: 403 }
    );
  }

  return session;
}

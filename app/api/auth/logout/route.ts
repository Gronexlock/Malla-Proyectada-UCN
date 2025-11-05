import { NextResponse } from "next/server";

/**
 * Cierra la sesión del usuario eliminando el token JWT
 */
export async function POST() {
  try {
    // Crear respuesta base
    const response = NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });

    // Eliminar la cookie 'token'
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Fuerza expiración inmediata
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

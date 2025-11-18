"use server";

import { cookies } from "next/headers";
import { AvanceSchema } from "../schemas/avanceSchema";
import { verifyToken } from "./authActions";

export async function fetchAvance(rut: string, codigoCarrera: string) {
  try {
    if (!rut || !codigoCarrera) {
      throw new Error(
        "Los parámetros 'rut' y 'codigoCarrera' son obligatorios"
      );
    }

    const token = (await cookies()).get("token")?.value;
    const payload = await verifyToken(token);

    if (payload.rut !== rut) {
      throw new Error("No autorizado para acceder a este recurso");
    }

    const url = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${rut}&codcarrera=${codigoCarrera}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(response.statusText);
      throw new Error("Error al obtener los datos");
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(
        "Avance no encontrado para el RUT y carrera proporcionados"
      );
    }

    const parsedData = AvanceSchema.safeParse(data);
    if (!parsedData.success) {
      console.error(parsedData.error);
      throw new Error("Los datos recibidos no cumplen con el esquema esperado");
    }

    return parsedData.data;
  } catch (error) {
    console.error("Error al obtener el avance curricular:", error);
    return [];
  }
}

"use server";

import { cookies } from "next/headers";
import { AvanceSchema } from "../schemas/avanceSchema";
import { CarreraSchema } from "../schemas/userSchema";
import { verifyToken } from "./authActions";
import { getUser } from "./cookiesActions";

export async function fetchAvance() {
  try {
    const token = (await cookies()).get("token")?.value;
    const [user, { selectedCarrera }] = await Promise.all([
      verifyToken(token),
      getUser(),
    ]);

    if (!selectedCarrera) {
      throw new Error("No se seleccionó una carrera");
    }

    const parsedCarrera = CarreraSchema.safeParse(selectedCarrera);
    if (!parsedCarrera.success) {
      console.error(parsedCarrera.error);
      throw new Error("La carrera no cumple con el esquema esperado");
    }

    if (
      !user.carreras.some(
        (carrera) => carrera.codigo === parsedCarrera.data.codigo
      )
    ) {
      throw new Error("La carrera no pertenece al usuario");
    }

    const url = `https://puclaro.ucn.cl/eross/avance/avance.php?rut=${user.rut}&codcarrera=${parsedCarrera.data.codigo}`;

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

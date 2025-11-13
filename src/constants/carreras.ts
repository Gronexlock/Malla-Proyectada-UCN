import { Carrera } from "../types/carrera";

export const nombresCompletos = {
  8606: "Ingeniería Civil en Computación e Informática",
  8616: "Ingeniería Civil Industrial",
  8266: "Ingeniería en Tecnologías de la Información",
};

export const carreras: Record<string, Carrera> = {
  icci: {
    codigo: "8606",
    nombre: "Ingeniería Civil en Computación e Informática",
    catalogo: "202320",
  },
  ici: {
    codigo: "8616",
    nombre: "Ingeniería Civil Industrial",
    catalogo: "202310",
  },
  iti: {
    codigo: "8266",
    nombre: "Ingeniería en Tecnologías de la Información",
    catalogo: "202410",
  },
};

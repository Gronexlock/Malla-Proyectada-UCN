"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/src/store/useUserStore";
import { nombresCompletos } from "@/src/constants/carreras";
import { setSelectedCarrera } from "@/src/actions/carrera";
import { useEffect } from "react";

export default function CarreraSelect() {
  const {
    carreras,
    setSelectedCarrera: setCarreraState,
    selectedCarrera,
    rut,
  } = useUserStore();

  useEffect(() => {
    async function initializeCarrera() {
      if (selectedCarrera) {
        await setSelectedCarrera(
          selectedCarrera.codigo,
          selectedCarrera.catalogo,
          rut
        );
      }
    }
    initializeCarrera();
  }, [selectedCarrera, rut]);

  const handleChange = async (codigo: string) => {
    const carrera = carreras.find((c) => c.codigo === codigo);
    if (carrera) {
      await setSelectedCarrera(carrera.codigo, carrera.catalogo, rut);
      setCarreraState(carrera);
    }
  };

  return (
    <Select
      value={selectedCarrera?.codigo || ""}
      onValueChange={(codigo) => handleChange(codigo)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecciona una carrera" />
      </SelectTrigger>
      <SelectContent>
        {carreras.map((carrera) => (
          <SelectItem value={carrera.codigo} key={carrera.codigo}>
            {nombresCompletos[carrera.codigo] || carrera.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

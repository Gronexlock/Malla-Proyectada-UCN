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

export default function CarreraSelect() {
  const { carreras, setSelectedCarrera } = useUserStore();

  return (
    <Select
      onValueChange={(codigo) => {
        const carrera = carreras.find((c) => c.codigo === codigo);
        if (carrera) setSelectedCarrera(carrera);
      }}
    >
      <SelectTrigger>
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

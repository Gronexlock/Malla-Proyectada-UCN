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

export function CarreraSelect() {
  const { carreras, selectedCarrera, setSelectedCarrera } = useUserStore();

  return (
    <Select value={selectedCarrera} onValueChange={setSelectedCarrera}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona una carrera" />
      </SelectTrigger>
      <SelectContent>
        {carreras.map((c) => (
          <SelectItem key={c.codigo} value={c.codigo}>
            {nombresCompletos[c.codigo] || c.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

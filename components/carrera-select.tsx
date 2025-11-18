"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUser, setSelectedCarrera } from "@/src/actions/cookiesActions";
import { nombresCompletos } from "@/src/constants/carreras";
import { User } from "@/src/schemas/userSchema";
import { useEffect, useState, useTransition } from "react";

export default function CarreraSelect() {
  const [user, setUser] = useState<User>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const user = await getUser();
      setUser(user);
    });
  }, []);

  const handleChange = async (codigo: string) => {
    const carrera = user?.carreras.find((c) => c.codigo === codigo);
    if (carrera) {
      await setSelectedCarrera(carrera.codigo);
      setUser((prevUser) =>
        prevUser ? { ...prevUser, selectedCarrera: carrera } : prevUser
      );
      const handleChange = async (codigo: string) => {
        const carrera = user?.carreras.find((c) => c.codigo === codigo);
        if (carrera) {
          await setSelectedCarrera(carrera.codigo);
          // Actualiza el estado del usuario con la nueva carrera seleccionada
          setUser((prevUser) =>
            prevUser
              ? { ...prevUser, selectedCarrera: { ...carrera } }
              : undefined
          );
        }
      };
    }
  };

  return (
    <Select
      value={user?.selectedCarrera.codigo || ""}
      onValueChange={(codigo) => handleChange(codigo)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecciona una carrera" />
      </SelectTrigger>
      <SelectContent>
        {user?.carreras.map((carrera) => (
          <SelectItem value={carrera.codigo} key={carrera.codigo}>
            {nombresCompletos[Number(carrera.codigo)] || carrera.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

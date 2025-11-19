"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setSelectedCarrera } from "@/src/actions/cookiesActions";
import { nombresCompletos } from "@/src/constants/carreras";
import { User } from "@/src/schemas/userSchema";
import { useState } from "react";

type CarreraSelectProps = {
  user: User;
};

export default function CarreraSelect(userProp: CarreraSelectProps) {
  const [user, setUser] = useState<User>(userProp.user);

  const handleChange = async (codigo: string) => {
    const carrera = user.carreras.find((c) => c.codigo === codigo);
    if (carrera) {
      await setSelectedCarrera(carrera.codigo);
      setUser((prevUser) =>
        prevUser ? { ...prevUser, selectedCarrera: carrera } : prevUser
      );
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

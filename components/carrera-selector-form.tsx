"use client";

import { setSelectedCarrera } from "@/src/actions/cookiesActions";
import { nombresCompletos } from "@/src/constants/carrerasInfo";
import { User } from "@/src/schemas/userSchema";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type CarreraSelectorProps = {
  user: User;
};

export default function CarreraSelectorForm({ user }: CarreraSelectorProps) {
  const { carreras, selectedCarrera } = user;
  const [selected, setSelected] = useState<string>(
    selectedCarrera?.codigo || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  function handleSelect(codigoCarrera: string) {
    setSelected(codigoCarrera);
  }

  async function handleGuardar() {
    if (!selected) {
      toast.error("Por favor, selecciona una carrera.");
      return;
    }

    setIsLoading(true);
    try {
      const carrera = carreras.find((carrera) => carrera.codigo === selected);
      if (!carrera) {
        throw new Error("Carrera no encontrada");
      }

      const result = await setSelectedCarrera(carrera.codigo);
      if (result.success) {
        toast.success("Carrera seleccionada exitosamente");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al seleccionar la carrera"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const selectedCarreraData = carreras.find(
    (carrera) => carrera.codigo === selected
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Seleccionar Carrera</CardTitle>
        <CardDescription>Elige tu carrera</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="carrera-select" className="text-sm font-medium">
            Carrera
          </label>
          <Select value={selected} onValueChange={handleSelect}>
            <SelectTrigger id="carrera-select" className="mt-1">
              <SelectValue placeholder="Selecciona una carrera..." />
            </SelectTrigger>
            <SelectContent>
              {carreras.map((carrera) => (
                <SelectItem key={carrera.codigo} value={carrera.codigo}>
                  {nombresCompletos[Number(carrera.codigo)]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCarreraData && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">
              {nombresCompletos[Number(selectedCarreraData.codigo)]}
            </p>
            <p className="text-muted-foreground">
              Código: {selectedCarreraData.codigo}
            </p>
            <p className="text-muted-foreground">
              Catálogo: {selectedCarreraData.catalogo}
            </p>
          </div>
        )}

        <Button
          onClick={handleGuardar}
          disabled={
            !selected || isLoading || selected === selectedCarrera?.codigo
          }
          className="w-full"
        >
          {isLoading ? "Alternando..." : "Alternar Carrera"}
        </Button>
      </CardContent>
    </Card>
  );
}

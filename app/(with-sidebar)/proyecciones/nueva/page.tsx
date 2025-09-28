"use client";

import { CrearProyeccionView } from "@/components/crear-proyeccion-view";
import { useUserStore } from "@/src/store/useUserStore";

export default function Page() {
  const { rut, selectedCarrera } = useUserStore();

  return (
    <div className="p-4">
      <CrearProyeccionView carrera={selectedCarrera} rut={rut} />
    </div>
  );
}

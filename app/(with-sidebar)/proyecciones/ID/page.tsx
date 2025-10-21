"use client";

import { useParams, useRouter } from "next/navigation";
import { CrearProyeccionView } from "@/components/crear-proyeccion-view";
import { useUserStore } from "@/src/store/useUserStore";

export default function ProyeccionDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const { rut, selectedCarrera, proyecciones } = useUserStore();

  const index = parseInt(id as string);
  const proyeccion = proyecciones[index];

  if (!proyeccion) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.push("/proyecciones")}
          className="mb-4 px-4 py-2 bg-zinc-200 hover:bg-zinc-300 rounded-lg"
        >
          ← Volver al listado
        </button>
        <p className="text-center text-zinc-600">
          No se encontró la proyección seleccionada.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.push("/proyecciones")}
        className="mb-4 px-4 py-2 bg-zinc-200 hover:bg-zinc-300 rounded-lg"
      >
        ← Volver al listado
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Proyección N°{index + 1} —{" "}
        {
          proyeccion.proyecciones[proyeccion.proyecciones.length - 1]
            ?.semestre ?? "Sin semestre final"
        }
      </h1>

      <CrearProyeccionView
        carrera={selectedCarrera}
        rut={rut}
        
      />
    </div>
  );
}
